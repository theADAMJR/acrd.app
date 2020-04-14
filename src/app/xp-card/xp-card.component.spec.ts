import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XPCardComponent } from './xp-card.component';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { CustomizeXPCardComponent } from '../customize-xp-card/customize-xp-card.component';

describe('XPCardComponent', () => {
  let component: XPCardComponent;
  let fixture: ComponentFixture<XPCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XPCardComponent ],
      imports: [ HttpClientModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XPCardComponent);
    component = new XPCardComponent(new class {
      updateXPCard(xpCard: any) {
        return new Promise((resolve) => resolve());
      }
    } as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('xp card updated, URL updated', () => {
    const spy = spyOn(component, 'updateXPCard');
    const customizeComponent = fixture.debugElement.query(
        By.directive(CustomizeXPCardComponent))?.componentInstance as CustomizeXPCardComponent;

    customizeComponent?.xpCardUpdate.emit();

    expect(spy).toHaveBeenCalled();
  });
});
