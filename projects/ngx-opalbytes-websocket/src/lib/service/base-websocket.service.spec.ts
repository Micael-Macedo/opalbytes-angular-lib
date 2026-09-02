/* eslint-disable no-console */
import { Subject, Subscription } from 'rxjs';

import { CaoWebSocketState } from '../enum/websocket-state.enum';
import { ICaoWebSocketConfig } from '../interface/websocket-config.model';

import { CaoWebSocketService } from './base-websocket.service';

class MockWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  static instances: MockWebSocket[] = [];

  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  readyState = MockWebSocket.CONNECTING;
  send: ReturnType<typeof vi.fn> = vi.fn();
  close: ReturnType<typeof vi.fn>;

  constructor(public url: string, public protocols?: string[]) {
    this.close = vi.fn((code = 1000, reason?: string) => {
      this.readyState = MockWebSocket.CLOSED;
      void code;
      void reason;
    });
    MockWebSocket.instances.push(this);
  }
}

function makeCloseEvent(code = 1000, reason = ''): CloseEvent {
  return { code, reason, wasClean: code === 1000 } as CloseEvent;
}

function makeMessageEvent(data: string): MessageEvent {
  return { data } as MessageEvent;
}

const getLatestSocket = (): MockWebSocket =>
  MockWebSocket.instances[MockWebSocket.instances.length - 1];

function openSocket(socket: MockWebSocket): void {
  socket.readyState = MockWebSocket.OPEN;
  socket.onopen?.(new Event('open'));
}

function emitMessage(socket: MockWebSocket, data: string): void {
  socket.onmessage?.(makeMessageEvent(data));
}

function emitClose(socket: MockWebSocket, code = 1000, reason = ''): void {
  socket.onclose?.(makeCloseEvent(code, reason));
}

function emitError(socket: MockWebSocket): void {
  socket.onerror?.(new Event('error'));
}

class TestWebSocketService extends CaoWebSocketService<string, unknown> {
  getDefaultConfig(): ICaoWebSocketConfig {
    return { url: 'ws://localhost:8080' };
  }

  transformRequest(data: string): unknown {
    return { payload: data };
  }

  transformResponse(data: unknown): unknown {
    return data;
  }

  handleError = vi.fn();

  exposeScheduleReconnect(): void {
    this.scheduleReconnect();
  }

  exposeClearReconnectTimer(): void {
    this.clearReconnectTimer();
  }

  exposeReconnectAttempt(): number {
    return this.reconnectAttempt;
  }

  exposeSetReconnectAttempt(value: number): void {
    this.reconnectAttempt = value;
  }

  exposeConfig(): ICaoWebSocketConfig {
    return this.config;
  }

  exposeConnection$() {
    return this.connection$;
  }

  exposeState$() {
    return this.state$;
  }
}

describe('CaoWebSocketService', () => {
  let service: TestWebSocketService;

  function initService(overrides?: Partial<ICaoWebSocketConfig>): TestWebSocketService {
    const svc = new TestWebSocketService();
    svc.connect(overrides).subscribe();
    return svc;
  }

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    MockWebSocket.instances = [];
    vi.stubGlobal('WebSocket', MockWebSocket);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  describe('connect()', () => {
    it('should transition Connecting → Connected on successful open', () => {
      service = new TestWebSocketService();
      const states: string[] = [];
      service.connectionState.subscribe(s => states.push(s));

      service.connect().subscribe();
      openSocket(getLatestSocket());

      expect(states).toContain(CaoWebSocketState.Connecting);
      expect(states).toContain(CaoWebSocketState.Connected);
      expect(service.currentState).toBe(CaoWebSocketState.Connected);
    });

    it('should emit true on successful connection', (done: () => void) => {
      service = new TestWebSocketService();
      service.connect().subscribe({
        next: (val) => {
          expect(val).toBe(true);
          done();
        },
      });

      openSocket(getLatestSocket());
    });

    it('should store the connection in connection$', () => {
      service = new TestWebSocketService();
      service.connect().subscribe();
      openSocket(getLatestSocket());

      expect(service.exposeConnection$().value).toBeInstanceOf(Object);
    });

    it('should reset reconnectAttempt to 0 on successful reconnection', () => {
      service = initService({ reconnect: true, reconnectAttempts: 3, reconnectInterval: 1000 });
      openSocket(getLatestSocket());

      service.exposeScheduleReconnect();
      expect(service.exposeReconnectAttempt()).toBe(1);

      vi.advanceTimersByTime(1000);
      openSocket(getLatestSocket());

      expect(service.exposeReconnectAttempt()).toBe(0);
    });

    it('should merge configOverride with default config', () => {
      service = new TestWebSocketService();
      service.connect({ reconnect: true, reconnectAttempts: 10 }).subscribe();
      openSocket(getLatestSocket());

      const cfg = service.exposeConfig();
      expect(cfg.url).toBe('ws://localhost:8080');
      expect(cfg.reconnect).toBe(true);
      expect(cfg.reconnectAttempts).toBe(10);
    });

    it('should create a WebSocket with the configured url', () => {
      service = new TestWebSocketService();
      service.connect().subscribe();

      const socket = getLatestSocket();
      expect(socket.url).toBe('ws://localhost:8080');
    });

    it('should emit Connecting state after calling connect', () => {
      service = new TestWebSocketService();
      const states: CaoWebSocketState[] = [];
      service.connectionState.subscribe(s => states.push(s));

      service.connect().subscribe();

      expect(states).toContain(CaoWebSocketState.Connecting);
    });

    describe('error on initial connection', () => {
      it('should error the observer', (done: () => void) => {
        service = new TestWebSocketService();

        service.connect().subscribe({
          error: (err) => {
            expect(err).toBeInstanceOf(Event);
            done();
          },
        });

        const socket = getLatestSocket();
        socket.onerror?.(new Event('error'));
      });
    });
  });

  describe('message handling', () => {
    beforeEach(() => {
      service = initService();
      openSocket(getLatestSocket());
    });

    it('should parse valid JSON messages and emit through messages$', (done: () => void) => {
      const raw = { type: 'test', value: 42 };

      service.messages.subscribe({
        next: (msg) => {
          expect(msg.success).toBe(true);
          expect(msg.data).toEqual(raw);
          expect(msg.metadata).toEqual({});
          done();
        },
      });

      emitMessage(getLatestSocket(), JSON.stringify(raw));
    });

    it('should call transformResponse on received messages', () => {
      const spy = vi.spyOn(service, 'transformResponse');
      const raw = { key: 'val' };

      emitMessage(getLatestSocket(), JSON.stringify(raw));

      expect(spy).toHaveBeenCalledWith(raw);
    });

    it('should call handleError on invalid JSON', () => {
      emitMessage(getLatestSocket(), 'invalid-json');

      expect(service.handleError).toHaveBeenCalled();
    });
  });

  describe('close event handling', () => {
    beforeEach(() => {
      service = new TestWebSocketService();
    });

    it('should set state to Disconnected on close', () => {
      service.connect().subscribe();
      const socket = getLatestSocket();
      openSocket(socket);
      emitClose(socket, 1000, 'Normal closure');

      expect(service.currentState).toBe(CaoWebSocketState.Disconnected);
    });

    it('should not schedule reconnect when code is 1000', () => {
      const spy = vi.spyOn(service as never, 'scheduleReconnect');

      service.connect({ reconnect: true }).subscribe();
      const socket = getLatestSocket();
      openSocket(socket);
      emitClose(socket, 1000);

      expect(spy).not.toHaveBeenCalled();
    });

    it('should schedule reconnect when code is not 1000 and reconnect=true', () => {
      const spy = vi.spyOn(service as never, 'scheduleReconnect');

      service.connect({ reconnect: true }).subscribe();
      const socket = getLatestSocket();
      openSocket(socket);
      emitClose(socket, 1006);

      expect(spy).toHaveBeenCalled();
    });

    it('should not schedule reconnect when reconnect=false', () => {
      const spy = vi.spyOn(service as never, 'scheduleReconnect');

      service.connect({ reconnect: false }).subscribe();
      const socket = getLatestSocket();
      openSocket(socket);
      emitClose(socket, 1006);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('error after connected', () => {
    it('should call handleError when error event fires after connection', () => {
      service = initService();
      const socket = getLatestSocket();
      openSocket(socket);

      emitError(socket);

      expect(service.handleError).toHaveBeenCalled();
    });
  });

  describe('disconnect()', () => {
    beforeEach(() => {
      service = new TestWebSocketService();
    });

    it('should close socket with code 1000 and destroy it', () => {
      service.connect().subscribe();
      const socket = getLatestSocket();
      openSocket(socket);

      service.disconnect();

      expect(socket.close).toHaveBeenCalledWith(1000, 'Normal closure');
      expect(service.exposeConnection$().value).toBeNull();
    });

    it('should set state to Disconnected', () => {
      service.connect().subscribe();
      openSocket(getLatestSocket());
      service.disconnect();

      expect(service.currentState).toBe(CaoWebSocketState.Disconnected);
    });

    it('should handle disconnect when no connection exists', () => {
      expect(() => service.disconnect()).not.toThrow();
      expect(service.currentState).toBe(CaoWebSocketState.Disconnected);
    });

    it('should clear reconnect timer', () => {
      service = initService({ reconnect: true });
      openSocket(getLatestSocket());

      service.exposeScheduleReconnect();
      expect(vi.getTimerCount()).toBeGreaterThan(0);

      service.disconnect();
      expect(vi.getTimerCount()).toBe(0);
      expect(service.exposeReconnectAttempt()).toBe(0);
    });
  });

  describe('send()', () => {
    beforeEach(() => {
      service = new TestWebSocketService();
    });

    it('should transform, serialize, and send message when connection is open', () => {
      service.connect().subscribe();
      const socket = getLatestSocket();
      openSocket(socket);
      const spy = vi.spyOn(service, 'transformRequest');

      service.send('hello');

      expect(spy).toHaveBeenCalledWith('hello');
      expect(socket.send).toHaveBeenCalledWith(JSON.stringify({ payload: 'hello' }));
    });

    it('should not send when connection is null', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      service.send('hello');

      expect(service.exposeConnection$().value).toBeNull();
      expect(errorSpy).toHaveBeenCalledWith('[BaseWebSocket] Cannot send: connection not open');
      errorSpy.mockRestore();
    });

    it('should not send when connection isOpen is false', () => {
      service.connect().subscribe();
      const socket = getLatestSocket();
      socket.readyState = MockWebSocket.CLOSED;

      service.send('hello');

      expect(socket.send).not.toHaveBeenCalled();
    });

    it('should log error when connection is not open', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      service.send('hello');

      expect(errorSpy).toHaveBeenCalledWith('[BaseWebSocket] Cannot send: connection not open');
      errorSpy.mockRestore();
    });
  });

  describe('scheduleReconnect()', () => {
    beforeEach(() => {
      service = initService({ reconnect: true, reconnectAttempts: 3, reconnectInterval: 1000 });
      openSocket(getLatestSocket());
    });

    it('should set state to Reconnecting', () => {
      service.exposeScheduleReconnect();

      expect(service.currentState).toBe(CaoWebSocketState.Reconnecting);
    });

    it('should increment reconnectAttempt', () => {
      service.exposeScheduleReconnect();

      expect(service.exposeReconnectAttempt()).toBe(1);
    });

    it('should use exponential backoff delay (attempt 0: base * 2^0 = 1000ms)', () => {
      service.exposeScheduleReconnect();

      expect(vi.getTimerCount()).toBe(1);

      vi.advanceTimersByTime(999);
      expect(vi.getTimerCount()).toBe(1);

      vi.advanceTimersByTime(1);
      expect(vi.getTimerCount()).toBe(0);
    });

    it('should double delay on each consecutive scheduleReconnect call', () => {
      service.exposeScheduleReconnect();
      const timerCount1 = vi.getTimerCount();
      expect(timerCount1).toBe(1);

      service.exposeScheduleReconnect();
      expect(vi.getTimerCount()).toBe(2);

      vi.clearAllTimers();
    });

    it('should cap delay at 60000ms', () => {
      service = initService({ reconnect: true, reconnectAttempts: 10, reconnectInterval: 3000 });
      openSocket(getLatestSocket());

      const delays: number[] = [];
      for (let i = 0; i < 6; i++) {
        service.exposeScheduleReconnect();
        const expected = Math.min(3000 * Math.pow(2, i), 60000);
        delays.push(expected);
        vi.advanceTimersByTime(expected);
        openSocket(getLatestSocket());
      }

      expect(delays[5]).toBe(60000);
    });

    it('should set state to Error when max attempts reached', () => {
      service = initService({ reconnect: true, reconnectAttempts: 2, reconnectInterval: 1000 });
      openSocket(getLatestSocket());

      service.exposeScheduleReconnect();
      expect(service.currentState).toBe(CaoWebSocketState.Reconnecting);

      service.exposeClearReconnectTimer();
      service.exposeSetReconnectAttempt(2);

      service.exposeScheduleReconnect();

      expect(service.currentState).toBe(CaoWebSocketState.Error);
    });

    it('should not schedule timer when max attempts reached', () => {
      service = initService({ reconnect: true, reconnectAttempts: 2, reconnectInterval: 1000 });
      openSocket(getLatestSocket());

      service.exposeScheduleReconnect();
      expect(vi.getTimerCount()).toBe(1);

      service.exposeClearReconnectTimer();
      service.exposeSetReconnectAttempt(2);
      service.exposeScheduleReconnect();
      expect(vi.getTimerCount()).toBe(0);
    });

    it('should recursively call scheduleReconnect on reconnection failure', () => {
      service.exposeScheduleReconnect();
      vi.advanceTimersByTime(1000);

      const newSocket = getLatestSocket();
      newSocket.onerror?.(new Event('error'));

      expect(service.currentState).toBe(CaoWebSocketState.Reconnecting);
    });

    it('should log success on successful reconnection', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

      service.exposeScheduleReconnect();
      vi.advanceTimersByTime(1000);

      openSocket(getLatestSocket());

      expect(logSpy).toHaveBeenCalledWith('[BaseWebSocket] Reconnected successfully');
      logSpy.mockRestore();
    });
  });

  describe('clearReconnectTimer()', () => {
    beforeEach(() => {
      service = new TestWebSocketService();
    });

    it('should clear an active timer', () => {
      service = initService({ reconnect: true });
      openSocket(getLatestSocket());
      service.exposeScheduleReconnect();

      expect(vi.getTimerCount()).toBeGreaterThan(0);

      service.exposeClearReconnectTimer();

      expect(vi.getTimerCount()).toBe(0);
      expect(service.exposeReconnectAttempt()).toBe(0);
    });

    it('should reset reconnectAttempt to 0', () => {
      service = initService({ reconnect: true });
      openSocket(getLatestSocket());
      service.exposeScheduleReconnect();
      service.exposeScheduleReconnect();

      service.exposeClearReconnectTimer();

      expect(service.exposeReconnectAttempt()).toBe(0);
    });

    it('should handle no active timer gracefully', () => {
      expect(() => service.exposeClearReconnectTimer()).not.toThrow();
      expect(service.exposeReconnectAttempt()).toBe(0);
    });
  });

  describe('destroy()', () => {
    beforeEach(() => {
      service = new TestWebSocketService();
    });

    it('should complete all subjects and disconnect', () => {
      service.connect().subscribe();
      const socket = getLatestSocket();
      openSocket(socket);

      service.destroy();

      expect(socket.close).toHaveBeenCalled();
    });

    it('should prevent further messages after destroy', (done: () => void) => {
      let messageReceived = false;

      service.messages.subscribe({
        next: () => { messageReceived = true; },
        complete: () => {
          expect(messageReceived).toBe(false);
          done();
        },
      });

      service.destroy();
    });

    it('should complete state$ after destroy', (done: () => void) => {
      let completed = false;

      service.connectionState.subscribe({
        complete: () => {
          completed = true;
          expect(completed).toBe(true);
          done();
        },
      });

      service.destroy();
    });
  });

  describe('getters', () => {
    beforeEach(() => {
      service = new TestWebSocketService();
    });

    it('messages should return observable of messages$', (done: () => void) => {
      service.connect().subscribe();
      const socket = getLatestSocket();
      openSocket(socket);

      const sub: Subscription = service.messages.subscribe({
        next: (msg) => {
          expect(msg.success).toBe(true);
          sub.unsubscribe();
          done();
        },
      });

      emitMessage(socket, JSON.stringify({ test: 1 }));
    });

    it('connectionState should return observable of state$', () => {
      const states: CaoWebSocketState[] = [];
      service.connectionState.subscribe(s => states.push(s));

      expect(states[0]).toBe(CaoWebSocketState.Disconnected);

      service = new TestWebSocketService();
      service.connect().subscribe();
      openSocket(getLatestSocket());
      service.connectionState.subscribe(s => states.push(s));

      expect(states).toContain(CaoWebSocketState.Connected);
    });

    it('currentState should return current state value', () => {
      expect(service.currentState).toBe(CaoWebSocketState.Disconnected);

      service.connect().subscribe();
      openSocket(getLatestSocket());

      expect(service.currentState).toBe(CaoWebSocketState.Connected);
    });

    it('isConnected should return true when connected', () => {
      expect(service.isConnected).toBe(false);

      service.connect().subscribe();
      openSocket(getLatestSocket());

      expect(service.isConnected).toBe(true);
    });

    it('isConnected should return false when disconnected', () => {
      service.connect().subscribe();
      openSocket(getLatestSocket());

      service.disconnect();

      expect(service.isConnected).toBe(false);
    });
  });

  describe('setupTimeoutHandler()', () => {
    beforeEach(() => {
      service = new TestWebSocketService();
    });

    it('should emit "timeout" after the specified delay', () => {
      const fn = (service as unknown as { setupTimeoutHandler: (t: number) => import('rxjs').Observable<'timeout'> }).setupTimeoutHandler;
      const obs = fn.call(service, 5000);
      const emitted: string[] = [];
      obs.subscribe(v => emitted.push(v));

      expect(emitted.length).toBe(0);

      vi.advanceTimersByTime(5000);

      expect(emitted).toEqual(['timeout']);
    });

    it('should not emit before the delay', () => {
      const fn = (service as unknown as { setupTimeoutHandler: (t: number) => import('rxjs').Observable<'timeout'> }).setupTimeoutHandler;
      const obs = fn.call(service, 5000);
      const emitted: string[] = [];
      obs.subscribe(v => emitted.push(v));

      vi.advanceTimersByTime(4999);

      expect(emitted.length).toBe(0);
    });
  });

  describe('generateCorrelationId()', () => {
    beforeEach(() => {
      service = new TestWebSocketService();
    });

    it('should return a valid UUID string', () => {
      const fn = (service as unknown as { generateCorrelationId: () => string }).generateCorrelationId;
      const id = fn.call(service);

      expect(typeof id).toBe('string');
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('should return unique values on each call', () => {
      const fn = (service as unknown as { generateCorrelationId: () => string }).generateCorrelationId;
      const id1 = fn.call(service);
      const id2 = fn.call(service);

      expect(id1).not.toBe(id2);
    });
  });

  describe('destroy$ cleanup', () => {
    beforeEach(() => {
      service = new TestWebSocketService();
    });

    it('should unsubscribe from connection observable streams on destroy', () => {
      service.connect({ reconnect: true }).subscribe();
      const socket = getLatestSocket();
      openSocket(socket);

      service.destroy();

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      emitMessage(socket, JSON.stringify({ data: 1 }));
      emitClose(socket, 1006);

      expect(service.currentState).toBe(CaoWebSocketState.Disconnected);

      errorSpy.mockRestore();
    });
  });
});
