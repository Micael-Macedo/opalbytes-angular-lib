import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseButton } from './base-button';

describe('BaseButton', () => {
  let component: BaseButton;
  let fixture: ComponentFixture<BaseButton>;
  let compiled: HTMLButtonElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseButton],
    })
      .compileComponents();

    fixture = TestBed.createComponent(BaseButton);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement.querySelector("button") as HTMLButtonElement
  });

  it("deveria criar", () => {
    expect(component).toBeTruthy();
  });

  describe("ação no botão", () => {
    it("deve emitir o evento buttonClick quando clicado", () => {
      const emitButtonClicked = vi.spyOn(component.buttonClick, "emit")
  
      component.onClick();
      expect(emitButtonClicked).toHaveBeenCalledWith();
    });
  
    it("não deve emitir o evento buttonClick quando desabilitado", () => {
      const emitButtonClicked = vi.spyOn(component.buttonClick, "emit")
  
      component.isDisabled = true;
  
      component.onClick();
      expect(emitButtonClicked).not.toHaveBeenCalled();
    });
  
    it("não deve emitir o evento buttonClick ao carregar", () => {
      const emitButtonClicked = vi.spyOn(component.buttonClick, "emit")
  
      component.isLoading = true;
  
      component.onClick();
      expect(emitButtonClicked).not.toHaveBeenCalled();
    });
  })

  describe("teste integração de classes padrão", () => {

    it("deve aplicar a classe de modo escuro quando isDarkMode for verdadeiro", async () => {
      const expectedStyle = "darkMode"
      component.isDarkMode = true;

      fixture.detectChanges();

      expect(compiled.classList.contains(expectedStyle)).toBeTruthy()
    });

    it("deve aplicar a classe de desabilidato quando desabilitado for verdadeiro", async () => {
      const expectedStyle = "disabled"
      component.isDisabled = true;

      fixture.detectChanges();

      expect(compiled.classList.contains(expectedStyle)).toBeTruthy()
    });

    it("deve aplicar a classe de modo carregando quando isLoading for verdadeiro", async () => {
      const expectedStyle = "loading"
      component.isLoading = true;

      fixture.detectChanges();

      expect(compiled.classList.contains(expectedStyle)).toBeTruthy()
    });

  });

  describe("data-cy", () => {
    it("deve adicionar data-cy padrão", async () => {
      const expectedText = "btn-clique!"

      component.dataCy = undefined
      component.ngOnInit()

      expect(component.dataCy).toBe(expectedText)
    })

    it("deve adicionar data-cy ao atributo do html", async () => {
      const expectedValue = "btn-clique!"

      component.ngOnInit()

      await fixture.whenStable()

      expect(compiled.attributes.getNamedItem("data-cy")?.value).toBe(expectedValue)
    })

    it("deve adicionar data-cy baseado no texto", async () => {
      const defaultBtnText = "hello-world"
      const expectedDataCy = "btn-hello-world"

      component.dataCy = undefined
      component.buttonText = defaultBtnText

      component.ngOnInit()

      expect(component.dataCy).toBe(expectedDataCy)
    })
  })
  describe("tooltip", () => {
    it("não deve exibir tooltip", () =>{
      component.tooltip = undefined
      component.buttonText = "Clique"

      component.ngOnInit()

      expect(component.tooltip).toBeUndefined()
    })

    it("exibir tooltip em caso de pelo menos 20 ", () =>{
      const expectedTooltip = "qqwertyuiopasdfghjklçzxcvb" 
      component.buttonText = expectedTooltip

      component.ngOnInit()

      expect(component.tooltip).toBe(expectedTooltip)
    })
  })
})
