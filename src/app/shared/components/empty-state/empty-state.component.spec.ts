import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [EmptyStateComponent] });
  });

  it('should display the message', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('message', 'Nenhum curso encontrado.');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nenhum curso encontrado.');
  });

  it('should render default icon when none provided', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('message', 'Vazio.');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon?.textContent?.trim()).toBe('inbox');
  });

  it('should render the provided icon', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('message', 'Vazio.');
    fixture.componentRef.setInput('icon', 'menu_book');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon?.textContent?.trim()).toBe('menu_book');
  });

  it('should not render subtitle when not provided', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('message', 'Vazio.');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-state__subtitle')).toBeNull();
  });

  it('should render subtitle when provided', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('message', 'Vazio.');
    fixture.componentRef.setInput('subtitle', 'Crie um curso para começar.');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.empty-state__subtitle');
    expect(el).not.toBeNull();
    expect(el.textContent).toContain('Crie um curso para começar.');
  });
});
