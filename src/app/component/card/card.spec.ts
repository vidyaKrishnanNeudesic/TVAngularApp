import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './card';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [Card],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    component = fixture.componentInstance;
    component.searchResult = signal([{ id: 1, name: 'Test Show' }]);
    component.searchText = signal('Test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  expect(component).toBeInstanceOf(Card);
  expect(component.searchResult).toBeDefined();
  expect(component.searchText).toBeDefined();
  expect(typeof component.goToDetails).toBe('function');
  });

  it('should update when searchResult changes', () => {
    component.searchResult = signal([{ id: 2, name: 'Another Show' }]);
    fixture.detectChanges();
    expect(component.searchResult()[0].name).toBe('Another Show');
  });

  it('should update when searchText changes', () => {
    component.searchText = signal('Another');
    fixture.detectChanges();
    expect(component.searchText()).toBe('Another');
  });

  it('should handle empty searchResult', () => {
    component.searchResult = signal([]);
    fixture.detectChanges();
    expect(component.searchResult().length).toBe(0);
  });

 /* it('should handle undefined searchResult', () => {
    // @ts-ignore
    component.searchResult = signal(undefined);
    fixture.detectChanges();
    expect(component.searchResult()).toBeUndefined();
  });*/

  it('should handle empty searchText', () => {
    component.searchText = signal('');
    fixture.detectChanges();
    expect(component.searchText()).toBe('');
  });

  it('should call router.navigate when goToDetails is called with valid id', () => {
    component.goToDetails(42);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', 42]);
  });

  it('should call router.navigate with 0 as id', () => {
    component.goToDetails(0);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', 0]);
  });

  it('should call router.navigate with negative id', () => {
    component.goToDetails(-1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', -1]);
  });

  it('should call router.navigate with NaN as id', () => {
    component.goToDetails(NaN);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', NaN]);
  });

it('should update when searchResult changes and reflect in template', () => {
  component.searchResult = signal([{ show: { id: 2, name: 'Another Show' } }]);
  fixture.detectChanges();
  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.textContent).toContain('Another Show');
});

  it('should update when searchText changes', () => {
    component.searchText = signal('Another');
    fixture.detectChanges();
    expect(component.searchText()).toBe('Another');
  });

  it('should not throw if goToDetails is called with undefined', () => {
    expect(() => component.goToDetails(undefined as any)).not.toThrow();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', undefined]);
  });

  it('should not throw if goToDetails is called with null', () => {
    expect(() => component.goToDetails(null as any)).not.toThrow();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', null]);
  });

  it('should not throw if goToDetails is called with a string', () => {
    expect(() => component.goToDetails('abc' as any)).not.toThrow();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', 'abc']);
  });

  it('should not throw if goToDetails is called with an object', () => {
    const obj = { foo: 'bar' };
    expect(() => component.goToDetails(obj as any)).not.toThrow();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', obj]);
  });


  it('should update when searchText changes', () => {
    component.searchText = signal('Another');
    fixture.detectChanges();
    expect(component.searchText()).toBe('Another');
  });

  it('should handle empty searchResult', () => {
    component.searchResult = signal([]);
    fixture.detectChanges();
    expect(component.searchResult().length).toBe(0);
  });


  it('should handle empty searchText', () => {
    component.searchText = signal('');
    fixture.detectChanges();
    expect(component.searchText()).toBe('');
  });

  it('should update when searchResult changes', () => {
    component.searchResult = signal([{ show: { id: 2, name: 'Another Show' } }]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Another Show');
  });

  it('should update when searchText changes', () => {
    component.searchText = signal('Another');
    fixture.detectChanges();
    expect(component.searchText()).toBe('Another');
  });
});
