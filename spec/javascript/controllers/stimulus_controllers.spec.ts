import { Application } from '@hotwired/stimulus';

// Individual controller imports
import LoginFormController from '@/controllers/login_form_controller';
import UserRegistrationFormController from '@/controllers/user_registration_form_controller';
import HomePageController from '@/controllers/home_page_controller';
import BusinessCardDetailController from '@/controllers/business_card_detail_controller';
import BusinessCardFormController from '@/controllers/business_card_form_controller';
import UserProfileController from '@/controllers/user_profile_controller';

// React and DOM mocking
const mockCreateRoot = jest.fn();
const mockRender = jest.fn();
const mockUnmount = jest.fn();

// Mock React
jest.mock('react', () => ({
  createElement: jest.fn((component, props) => ({ component, props }))
}));

// Mock react-dom/client
jest.mock('react-dom/client', () => ({
  createRoot: (...args: any[]) => {
    mockCreateRoot(...args);
    return {
      render: mockRender,
      unmount: mockUnmount
    };
  }
}));

// Mock individual React components
jest.mock('@/components/LoginForm', () => 'LoginForm');
jest.mock('@/components/UserRegistrationForm', () => 'UserRegistrationForm');
jest.mock('@/components/HomePage', () => ({ HomePage: 'HomePage' }));
jest.mock('@/components/BusinessCardDetail', () => ({ BusinessCardDetail: 'BusinessCardDetail' }));
jest.mock('@/components/SimilarCards', () => ({ SimilarCards: 'SimilarCards' }));
jest.mock('@/components/BusinessCardForm', () => ({ BusinessCardForm: 'BusinessCardForm' }));
jest.mock('@/components/UserProfile', () => ({ UserProfile: 'UserProfile' }));

// Console mocks
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Stimulus Controllers', () => {
  let application: Application;
  let element: HTMLElement;

  beforeEach(() => {
    // Stimulus application setup
    application = Application.start();

    // DOM element setup
    element = document.createElement('div');
    document.body.appendChild(element);

    // Clear all mocks
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    // Cleanup
    application.stop();
    document.body.removeChild(element);
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('LoginFormController', () => {
    beforeEach(() => {
      application.register('login-form', LoginFormController);
      element.setAttribute('data-controller', 'login-form');
      element.setAttribute('data-login-form-login-path-value', '/sessions');
      element.setAttribute('data-login-form-new-password-reset-path-value', '/password_resets/new');
    });

    it('初期化時に正しくconnectする', () => {
      expect(console.log).toHaveBeenCalledWith('=== LoginFormController connected ===');
      expect(console.log).toHaveBeenCalledWith('Login path:', '/sessions');
      expect(console.log).toHaveBeenCalledWith('Password reset path:', '/password_resets/new');
    });

    it('Reactコンポーネントが正しくマウントされる', () => {
      expect(mockCreateRoot).toHaveBeenCalledWith(element);
      expect(mockRender).toHaveBeenCalledWith({
        component: 'LoginForm',
        props: {
          loginPath: '/sessions',
          newPasswordResetPath: '/password_resets/new'
        }
      });
    });

  });

  describe('UserRegistrationFormController', () => {
    beforeEach(() => {
      application.register('user-registration-form', UserRegistrationFormController);
      element.setAttribute('data-controller', 'user-registration-form');
      element.setAttribute('data-user-registration-form-signup-path-value', '/users');
      element.setAttribute('data-user-registration-form-login-path-value', '/sessions/new');
    });

    it('初期化時に正しくconnectする', () => {
      expect(console.log).toHaveBeenCalledWith('=== UserRegistrationFormController connected ===');
      expect(console.log).toHaveBeenCalledWith('Signup path:', '/users');
      expect(console.log).toHaveBeenCalledWith('Login path:', '/sessions/new');
    });

    it('Reactコンポーネントが正しくマウントされる', () => {
      expect(mockCreateRoot).toHaveBeenCalledWith(element);
      expect(mockRender).toHaveBeenCalledWith({
        component: 'UserRegistrationForm',
        props: {
          signupPath: '/users',
          loginPath: '/sessions/new'
        }
      });
    });

  });

  describe('HomePageController', () => {
    const mockStats = { totalCards: 10, recentCards: 3 };

    beforeEach(() => {
      application.register('home-page', HomePageController);
      element.setAttribute('data-controller', 'home-page');
      element.setAttribute('data-home-page-stats-value', JSON.stringify(mockStats));
    });

    it('初期化時に正しくconnectする', () => {
      expect(console.log).toHaveBeenCalledWith('🎯 HomePageController connected');
    });

    it('stats値が正しく解析される', () => {
      expect(console.log).toHaveBeenCalledWith('Stats value parsed:', mockStats);
      expect(console.log).toHaveBeenCalledWith('✅ JSON parse successful:', mockStats);
    });

    it('Reactコンポーネントが正しくマウントされる', () => {
      expect(mockCreateRoot).toHaveBeenCalledWith(element);
      expect(mockRender).toHaveBeenCalledWith({
        component: 'HomePage',
        props: {
          stats: mockStats
        }
      });
    });

    it('disconnect時にrootがunmountされる', () => {
      // disconnect をシミュレート
      const controller = application.getControllerForElementAndIdentifier(element, 'home-page');
      controller?.disconnect();

      expect(mockUnmount).toHaveBeenCalled();
    });

  });

  describe('BusinessCardDetailController', () => {
    const mockCard = { id: 1, name: 'Test Card' };
    const mockSimilarCards = [{ id: 2, name: 'Similar Card' }];

    beforeEach(() => {
      application.register('business-card-detail', BusinessCardDetailController);
      element.setAttribute('data-controller', 'business-card-detail');
      element.setAttribute('data-business-card-detail-card-value', JSON.stringify(mockCard));
      element.setAttribute('data-business-card-detail-similar-cards-value', JSON.stringify(mockSimilarCards));
    });

    it('正しくconnectする', () => {
      expect(console.log).toHaveBeenCalledWith('BusinessCardDetailController connected');
    });

    it('React要素が正しく作成される', () => {
      expect(mockCreateRoot).toHaveBeenCalledWith(element);
      expect(mockRender).toHaveBeenCalled();
    });

    it('disconnect時にrootがunmountされる', () => {
      const controller = application.getControllerForElementAndIdentifier(element, 'business-card-detail');
      controller?.disconnect();

      expect(mockUnmount).toHaveBeenCalled();
    });
  });

  describe('BusinessCardFormController', () => {
    const mockCard = { id: 1, name: 'Test Card' };

    beforeEach(() => {
      application.register('business-card-form', BusinessCardFormController);
      element.setAttribute('data-controller', 'business-card-form');
      element.setAttribute('data-business-card-form-mode-value', 'edit');
      element.setAttribute('data-business-card-form-card-value', JSON.stringify(mockCard));
      element.setAttribute('data-business-card-form-errors-value', JSON.stringify([]));
    });

    it('正しくconnectする', () => {
      expect(console.log).toHaveBeenCalledWith('BusinessCardFormController connected');
    });

    it('React要素が正しく作成される', () => {
      expect(mockCreateRoot).toHaveBeenCalledWith(element);
      expect(mockRender).toHaveBeenCalled();
    });

    it('disconnect時にrootがunmountされる', () => {
      const controller = application.getControllerForElementAndIdentifier(element, 'business-card-form');
      controller?.disconnect();

      expect(mockUnmount).toHaveBeenCalled();
    });
  });

  describe('UserProfileController', () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };

    beforeEach(() => {
      application.register('user-profile', UserProfileController);
      element.setAttribute('data-controller', 'user-profile');
      element.setAttribute('data-user-profile-user-value', JSON.stringify(mockUser));
    });

    it('正しくconnectする', () => {
      expect(console.log).toHaveBeenCalledWith('UserProfileController connected');
    });

    it('React要素が正しく作成される', () => {
      expect(mockCreateRoot).toHaveBeenCalledWith(element);
      expect(mockRender).toHaveBeenCalled();
    });

    it('disconnect時にrootがunmountされる', () => {
      const controller = application.getControllerForElementAndIdentifier(element, 'user-profile');
      controller?.disconnect();

      expect(mockUnmount).toHaveBeenCalled();
    });
  });
});
