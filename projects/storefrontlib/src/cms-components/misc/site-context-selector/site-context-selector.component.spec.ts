import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CmsService,
  CmsSiteContextSelectorComponent,
  Component,
  contextServiceMapProvider,
  CurrencyService,
  Language,
  LanguageService,
  LANGUAGE_CONTEXT_ID,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CmsComponentData } from '../../../cms-structure/page/model/cms-component-data';
import { BootstrapModule } from '../../../lib/bootstrap.module';
import { SiteContextComponentService } from './site-context-component.service';
import { SiteContextSelectorComponent } from './site-context-selector.component';

@Pipe({
  name: 'cxTranslateUrl',
})
class MockTranslateUrlPipe implements PipeTransform {
  transform(): any {}
}

describe('SiteContextSelectorComponent in CmsLib', () => {
  let component: SiteContextSelectorComponent;
  let fixture: ComponentFixture<SiteContextSelectorComponent>;
  let serviceSpy: any;
  let el: DebugElement;

  const mockLanguages: Language[] = [
    { active: true, isocode: 'ja', name: 'Japanese', nativeName: 'Japanese' },
    { active: true, isocode: 'en', name: 'English', nativeName: 'English' },
  ];

  const mockActiveLang = 'en';

  const MockLanguageService = {
    active: mockActiveLang,
    getAll(): Observable<Language[]> {
      return of(mockLanguages);
    },
    getActive(): Observable<string> {
      return of(this.active);
    },
    setActive(isocode: string): void {
      this.active = isocode;
    },
  };

  const mockComponentData: CmsSiteContextSelectorComponent = {
    uid: 'LanguageComponent',
    typeCode: 'SiteContextSelectorComponent',
    context: LANGUAGE_CONTEXT_ID,
  };

  const MockCmsService = {
    getComponentData: () => of(mockComponentData),
  };

  const MockCmsComponentData = <CmsComponentData<Component>>{
    data$: of(mockComponentData),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BootstrapModule, BrowserAnimationsModule],
      declarations: [SiteContextSelectorComponent, MockTranslateUrlPipe],
      providers: [
        { provide: CmsService, useValue: MockCmsService },
        {
          provide: LanguageService,
          useValue: MockLanguageService,
        },
        {
          provide: CurrencyService,
          useValue: {},
        },
        {
          provide: CmsComponentData,
          useValue: MockCmsComponentData,
        },
        contextServiceMapProvider,
      ],
    })
      .overrideComponent(SiteContextSelectorComponent, {
        set: {
          providers: [
            {
              provide: SiteContextComponentService,
              useClass: SiteContextComponentService,
            },
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteContextSelectorComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    fixture.detectChanges();
    serviceSpy = fixture.debugElement.injector.get(LanguageService) as any;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get items$', () => {
    component.items$.subscribe(value => {
      expect(value).toEqual(mockLanguages);
    });
  });

  it('should get activeItem$', () => {
    component.activeItem$.subscribe(value => {
      expect(value).toEqual(mockActiveLang);
    });
  });

  it('should change language', () => {
    component.active = 'ja';
    serviceSpy.getActive().subscribe(value => expect(value).toEqual('ja'));
  });

  it('should contain a select with number of options', () => {
    const selectBox = el.query(By.css('select'));
    const select = <HTMLSelectElement>selectBox.nativeElement;
    expect(select.options.length).toEqual(mockLanguages.length);
  });
});