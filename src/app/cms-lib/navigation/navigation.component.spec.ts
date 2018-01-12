import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StoreModule, Store, combineReducers } from "@ngrx/store";
import { By } from "@angular/platform-browser";
import { of } from "rxjs/observable/of";
import * as fromRoot from "../../routing/store";
import * as fromCmsReducer from "../../newcms/store/reducers";
import { NavigationComponent } from "./navigation.component";
import { ConfigService } from "../../newcms/config.service";
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from "app/material.module";
import { MatMenuModule, MatIconModule } from '@angular/material';

export class UseConfigService {
  cmsComponentMapping = {
    CMSNavigationComponent: "NavigationComponent"
  };
}

fdescribe("CmsNavigationComponent in CmsLib", () => {
  let store: Store<fromCmsReducer.CmsState>;
  let navigationComponent: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let el: DebugElement;

  const componentData = {
    uid: "MockNavigationComponent",
    typeCode: "NavigationComponent",
    modifiedTime: "2017-12-21T18:15:15+0000",
    name: "TestNavigationComponent",
    container: "false",
    type: "Navigation Component",
    styleClass: "nav-order-tools",
    navigationNode: [{
      uid: "MockNavigationNode001",
      children: [{
        uid: "MockChildNode001",
        entries: [{
          item: [{
            external: false,
            linkName: "MockLinkName001",
            target: "SAMEWINDOW",
            url: "/mockLinkName001"
          }],
          itemId: "MockLink001"
        }]
      }]
    },
    {
      uid: "MockNavigationNode002",
      children: [{
        uid: "MockChildNode002",
        entries: [{
          item: [{
            external: false,
            linkName: "MockLinkName002",
            target: "SAMEWINDOW",
            url: "/mockLinkName002"
          }],
          itemId: "MockLink002"
        }]
      }]
    }]
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          MatMenuModule,
          MatIconModule,
          StoreModule.forRoot({
            ...fromRoot.reducers,
            cms: combineReducers(fromCmsReducer.reducers)
          }),
          RouterTestingModule
        ],
        declarations: [NavigationComponent],
        providers: [{ provide: ConfigService, useClass: UseConfigService }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    navigationComponent = fixture.componentInstance;

    el = fixture.debugElement;

    store = TestBed.get(Store);
    spyOn(store, "select").and.returnValue(of(componentData));
  });

  it("should be created", () => {
    expect(navigationComponent).toBeTruthy();
  });

  it("should contain cms content in the html rendering after bootstrap", () => {
    expect(navigationComponent.component).toBeNull();
    navigationComponent.bootstrap();
    expect(navigationComponent.component).toBe(componentData);
  });
});
