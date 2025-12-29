// Import Angular testing utilities
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Import the component under test
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  // `component` will reference the Dashboard component instance
  let component: Dashboard;

  // `fixture` is a wrapper that allows testing component rendering + change detection
  let fixture: ComponentFixture<Dashboard>;

  // This block runs before each test
  beforeEach(async () => {
    // Configure the testing module for this component
    await TestBed.configureTestingModule({

      // Because you're using standalone components, you import the component directly
      imports: [Dashboard]

    })
      // Angular compiles the component's HTML + CSS + dependencies
      .compileComponents();

    // Create the component instance inside the TestBed environment
    fixture = TestBed.createComponent(Dashboard);

    // Access the component class instance (the one with your logic)
    component = fixture.componentInstance;

    // Wait until Angular finishes asynchronous tasks before running tests
    await fixture.whenStable();
  });

  // A simple test: checks if the component is successfully created
  it('should create', () => {
    expect(component).toBeTruthy(); // The component should not be null or undefined
  });
});
