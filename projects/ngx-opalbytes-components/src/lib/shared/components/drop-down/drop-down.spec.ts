import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DropDownComponent } from "./drop-down";
import { By } from "@angular/platform-browser";
import { AbstractControl } from "@angular/forms";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("DropDownComponent", () => {
  let component: DropDownComponent;
  let fixture: ComponentFixture<DropDownComponent>;

  const mockOptions = [{ nome: "Item 1", icon: "home" }, { nome: "Item 2" }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropDownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropDownComponent);
    component = fixture.componentInstance;
    component.options = mockOptions;
    component.textHeader = "Selecione";
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("deve criar o componente", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("deve exibir o texto do cabeçalho quando nenhum item estiver selecionado", () => {
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css(".dropdown-header span")).nativeElement;
    expect(header.textContent.trim()).toBe("Selecione");
  });

  it("deve alternar o dropdown ao clicar no cabeçalho", () => {
    fixture.detectChanges();
    const header = fixture.debugElement.query(By.css(".dropdown-header"));
    
    // Primeiro clique para abrir
    header.triggerEventHandler("click", new Event('click'));
    fixture.detectChanges();
    
    expect(component.isOpen).toBeTruthy();
    
    // Verificar se a lista está visível
    const list = fixture.debugElement.query(By.css(".dropdown-list"));
    expect(list).toBeTruthy();
    
    // Segundo clique para fechar
    header.triggerEventHandler("click", new Event('click'));
    fixture.detectChanges();
    
    expect(component.isOpen).toBeFalsy();
  });

  it("deve exibir os itens da lista quando o dropdown estiver aberto", () => {
    // Abrir dropdown ANTES do primeiro detectChanges
    component.isOpen = true;
    component["checkAvailableSpace"]();
    
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css(".dropdown-item"));
    expect(items.length).toBe(mockOptions.length);
    expect(items[0].nativeElement.textContent).toContain("Item 1");
    expect(items[1].nativeElement.textContent).toContain("Item 2");
  });

  it("deve exibir o ícone quando o item possuir um", () => {
    // Abrir dropdown ANTES do primeiro detectChanges
    component.isOpen = true;
    component["checkAvailableSpace"]();
    
    fixture.detectChanges();

    const icons = fixture.debugElement.queryAll(By.css(".dropdown-icon"));
    // Apenas o primeiro item tem ícone
    expect(icons.length).toBe(1);
    expect(icons[0].nativeElement.textContent.trim()).toBe("home");
  });

  it("deve selecionar um item e fechar o dropdown", () => {
    const emitSpy = vi.spyOn(component.itemSelected, "emit");
    const markAsTouchedSpy = vi.spyOn(component as any, "markAsTouched");
    
    // Abrir dropdown ANTES do primeiro detectChanges
    component.isOpen = true;
    component["checkAvailableSpace"]();
    
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css(".dropdown-item"));
    items[0].triggerEventHandler("click", new Event('click'));
    fixture.detectChanges();

    expect(component.selectedItem).toEqual(mockOptions[0]);
    expect(component.isOpen).toBeFalsy();
    expect(emitSpy).toHaveBeenCalledWith(mockOptions[0]);
    expect(markAsTouchedSpy).toHaveBeenCalled();
  });

  it("deve exibir o texto do item selecionado no cabeçalho", () => {
    // Configurar o estado ANTES da primeira detecção
    component.selectedItem = mockOptions[1];
    
    // Agora detectar mudanças
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css(".dropdown-header span")).nativeElement;
    expect(header.textContent.trim()).toBe("Item 2");
  });

  it("deve fechar o dropdown ao clicar fora do componente", () => {
    // Abrir dropdown ANTES do primeiro detectChanges
    component.isOpen = true;
    component["checkAvailableSpace"]();
    
    fixture.detectChanges();
    
    // Simular clique fora
    const clickEvent = new MouseEvent('click');
    document.dispatchEvent(clickEvent);
    
    // Angular precisa processar o evento assíncrono
    fixture.detectChanges();

    expect(component.isOpen).toBeFalsy();
  });

  it("não deve fechar o dropdown se o clique for dentro do componente", () => {
    // Abrir dropdown ANTES do primeiro detectChanges
    component.isOpen = true;
    component["checkAvailableSpace"]();
    
    fixture.detectChanges();

    // Simular clique no container do dropdown
    const container = fixture.debugElement.query(By.css(".dropdown-container"));
    container.triggerEventHandler("click", new Event('click', { bubbles: true }));
    fixture.detectChanges();

    expect(component.isOpen).toBeTruthy();
  });

  it("deve setar o valor corretamente com writeValue para item existente", () => {
    fixture.detectChanges();
    
    component.writeValue("Item 2");
    fixture.detectChanges();

    expect(component.selectedItem).toEqual(mockOptions[1]);
  });

  it("não deve alterar selectedItem com writeValue para item inexistente", () => {
    fixture.detectChanges();
    
    component.selectedItem = mockOptions[0];
    component.writeValue("Item inexistente");
    fixture.detectChanges();
    
    expect(component.selectedItem).toEqual(mockOptions[0]);
  });

  it("deve chamar onChange ao selecionar um item", () => {
    fixture.detectChanges();
    
    const onChangeSpy = vi.fn();
    component.registerOnChange(onChangeSpy);
    
    component.selectItem(mockOptions[0]);
    
    // O componente está passando o objeto completo, não apenas o nome
    expect(onChangeSpy).toHaveBeenCalledWith(mockOptions[0]);
  });

  it("deve chamar onTouched ao marcar como touched", () => {
    fixture.detectChanges();
    
    const onTouchedSpy = vi.fn();
    component.registerOnTouched(onTouchedSpy);
    
    // Chamar toggleDropdown para disparar touched
    component.toggleDropdown();
    
    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it("deve retornar o nome do controle através do getter", () => {
    fixture.detectChanges();
    
    component.controlName = "dropdown";
    expect(component.controlNameValue).toBe("dropdown");
  });

  it("deve retornar erro de campo obrigatório se control estiver touched e vazio", () => {
    fixture.detectChanges();
    
    const fakeControl = {
      touched: true,
      dirty: false,
      hasError: (err: string) => err === "required",
      get: () => null,
    } as unknown as AbstractControl;

    component.control = fakeControl;
    component.selectedItem = undefined;
    fixture.detectChanges();

    expect(component.errorText).toBe("*Campo obrigatório");
  });

  it("deve retornar null no errorText se não houver erro", () => {
    // Configurar ANTES de detectChanges
    component.selectedItem = mockOptions[0];
    
    const fakeControl = {
      touched: false,
      hasError: () => false,
      get: () => null,
    } as unknown as AbstractControl;

    component.control = fakeControl;
    
    fixture.detectChanges();

    expect(component.errorText).toBeNull();
  });

  it("markAsTouched deve chamar onTouched e marcar controle como touched", () => {
    fixture.detectChanges();
    
    component.isTouched = false;
    
    // Criar um spy para markAsTouched
    const markAsTouchedSpy = vi.fn();
    component.control = {
      markAsTouched: markAsTouchedSpy,
    } as any;
    
    const onTouchedSpy = vi.fn();
    component.registerOnTouched(onTouchedSpy);

    component["markAsTouched"]();

    expect(onTouchedSpy).toHaveBeenCalled();
    expect(markAsTouchedSpy).toHaveBeenCalled();
    expect(component.isTouched).toBeTruthy();
  });

  it("markAsTouched não deve chamar onTouched se já estiver tocado", () => {
    fixture.detectChanges();
    
    component.isTouched = true;
    const onTouchedSpy = vi.fn();
    component.registerOnTouched(onTouchedSpy);

    component["markAsTouched"]();

    expect(onTouchedSpy).not.toHaveBeenCalled();
  });

  describe("checkAvailableSpace", () => {
    it('deve definir dropDirection como "up" se dropDirectionInput for "up"', () => {
      fixture.detectChanges();
      
      component.dropDirectionInput = "up";
      component["checkAvailableSpace"]();
      expect(component.dropDirection).toBe("up");
    });

    it('deve definir dropDirection como "up" se não houver espaço suficiente abaixo', () => {
      fixture.detectChanges();
      
      component.dropDirectionInput = "down";
      
      // Mock do getBoundingClientRect
      const mockRect = {
        bottom: window.innerHeight - 100,
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        width: 200,
        x: 0,
        y: 0,
        toJSON: () => ({})
      };
      
      // Mock do elemento
      const mockElement = {
        getBoundingClientRect: vi.fn(() => mockRect)
      };
      
      // Substituir o elemento nativo
      component["_eref"].nativeElement = mockElement;

      component["checkAvailableSpace"]();
      expect(component.dropDirection).toBe("up");
    });

    it('deve definir dropDirection como "down" se houver espaço suficiente abaixo', () => {
      fixture.detectChanges();
      
      component.dropDirectionInput = "down";
      
      // Mock do getBoundingClientRect
      const mockRect = {
        bottom: 100,
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        width: 200,
        x: 0,
        y: 0,
        toJSON: () => ({})
      };
      
      // Mock do elemento
      const mockElement = {
        getBoundingClientRect: vi.fn(() => mockRect)
      };
      
      // Substituir o elemento nativo
      component["_eref"].nativeElement = mockElement;

      component["checkAvailableSpace"]();
      expect(component.dropDirection).toBe("down");
    });
  });
});