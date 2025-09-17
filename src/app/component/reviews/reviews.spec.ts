import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Reviews } from './reviews';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Review } from '../../model/review';
import { v4 as uuidv4 } from 'uuid';

describe('Reviews', () => {
  let component: Reviews;
  let fixture: ComponentFixture<Reviews>;
  let routerSpy: jasmine.SpyObj<Router>;
  let storeSpy: jasmine.SpyObj<Store<any>>;
  let activatedRouteStub: any;

  const mockReviews: Review[] = [
    { id: '1', showId: 'show-1', rating: 5, comment: 'Great!' },
    { id: '2', showId: 'show-2', rating: 4, comment: 'Good!' }
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    storeSpy.select.and.returnValue(of(mockReviews));
    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('show-1')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        Reviews,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Store, useValue: storeSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Reviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(Reviews);
  });

  it('should throw error if showId is missing', () => {
    activatedRouteStub.snapshot.paramMap.get.and.returnValue(null);
    expect(() => {
      TestBed.createComponent(Reviews).componentInstance;
    }).toThrowError('showId is required');
  });

 it('should filter reviews by showId on init', () => {
    expect(component.reviews()).toEqual([
      { id: '1', showId: 'show-1', rating: 5, comment: 'Great!' }
    ]);
  });

  it('should update reviews signal on store change', () => {
    const newReviews: Review[] = [
      { id: '3', showId: 'show-1', rating: 3, comment: 'Okay' }
    ];
    storeSpy.select.and.returnValue(of(newReviews));
    component.ngOnInit();
    expect(component.reviews()).toEqual([
      { id: '3', showId: 'show-1', rating: 3, comment: 'Okay' }
    ]);
  });

  it('should dispatch addReview on valid submit', () => {
   // spyOn(uuidv4, 'apply').and.returnValue('uuid-mock');
    component.rating.set(4);
    component.comment.set('Nice show!');
    component.reviewForm.get('rating')?.setValue(4);
    component.reviewForm.get('comment')?.setValue('Nice show!');
    component.editingId.set(null);

    component.submitReview(new Event('submit'));

    expect(storeSpy.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
      type: '[Review] Add',
      review: jasmine.objectContaining({
        showId: 'show-1',
        rating: 4,
        comment: 'Nice show!'
      })
    }));
    expect(component.rating()).toBeNull();
    expect(component.comment()).toBe('');
  });

  it('should dispatch updateReview on valid submit when editing', () => {
    component.editingId.set('1');
    component.rating.set(5);
    component.comment.set('Updated comment');
    component.reviewForm.get('rating')?.setValue(5);
    component.reviewForm.get('comment')?.setValue('Updated comment');

    component.submitReview(new Event('submit'));

    expect(storeSpy.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
      type: '[Review] Update',
      review: jasmine.objectContaining({
        id: '1',
        showId: 'show-1',
        rating: 5,
        comment: 'Updated comment'
      })
    }));
    expect(component.editingId()).toBeNull();
  });

  it('should not dispatch if form is invalid', () => {
    component.reviewForm.get('rating')?.setValue('');
    component.reviewForm.get('comment')?.setValue('');
    component.rating.set(null);
    component.comment.set('');
    component.submitReview(new Event('submit'));
    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  });

  it('should set editingId, rating, and comment on editReview', () => {
    const review: Review = { id: '1', showId: 'show-1', rating: 3, comment: 'Edit me' };
    component.editReview(review);
    expect(component.editingId()).toBe('1');
    expect(component.rating()).toBe(3);
    expect(component.comment()).toBe('Edit me');
  });

  it('should dispatch deleteReview and reset editing state if editingId matches', () => {
    component.editingId.set('1');
    component.rating.set(4);
    component.comment.set('To be deleted');
    component.deleteReview('1');
    expect(storeSpy.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
      type: '[Review] Delete',
      id: '1'
    }));
    expect(component.editingId()).toBeNull();
    expect(component.rating()).toBeNull();
    expect(component.comment()).toBe('');
  });

  it('should dispatch deleteReview and not reset editing state if editingId does not match', () => {
    component.editingId.set('2');
    component.rating.set(4);
    component.comment.set('To be deleted');
    component.deleteReview('1');
    expect(storeSpy.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
      type: '[Review] Delete',
      id: '1'
    }));
    expect(component.editingId()).toBe('2');
    expect(component.rating()).toBe(4);
    expect(component.comment()).toBe('To be deleted');
  });

  it('should reset editing state on cancelEdit', () => {
    component.editingId.set('1');
    component.rating.set(5);
    component.comment.set('Cancel me');
    component.cancelEdit();
    expect(component.editingId()).toBeNull();
    expect(component.rating()).toBeNull();
    expect(component.comment()).toBe('');
  });

  it('should navigate to show details if showId exists', () => {
    component.goShowDetails();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', 'show-1']);
  }); 
});
