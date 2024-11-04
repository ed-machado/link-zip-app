import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { encurtarUrl } from '../../Services/urlServices';
import './Home.css';

// Types
interface UrlResponse {
  urlCode: string;
  error?: string;
}

interface FormState {
  originalUrl: string;
  shortenedUrl: string;
  error: string;
  isLoading: boolean;
  isCopied: boolean;
  showSuccessMessage: boolean;
}

// Initial state
const initialFormState: FormState = {
  originalUrl: '',
  shortenedUrl: '',
  error: '',
  isLoading: false,
  isCopied: false,
  showSuccessMessage: false
};

function Home() {
  // States
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const navigate = useNavigate();

  // URL validation
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // URL change handler
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState(prev => ({
      ...prev,
      originalUrl: e.target.value,
      error: ''  // Clear error when user starts typing
    }));
  };

  // Shorten URL handler
  const handleShorten = async (): Promise<void> => {
    const url = formState.originalUrl.trim();

    // Initial validation
    if (!url) {
      setFormState(prev => ({
        ...prev,
        error: 'Please enter a URL to shorten.'
      }));
      return;
    }

    if (!isValidUrl(url)) {
      setFormState(prev => ({
        ...prev,
        error: 'Please enter a valid URL (e.g., https://example.com)'
      }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response: UrlResponse = await encurtarUrl(url);

      if (response.urlCode) {
        const formattedUrl = `http://localhost:5001/api/url/${response.urlCode}`;
        setFormState(prev => ({
          ...prev,
          shortenedUrl: formattedUrl,
          showSuccessMessage: true
        }));
      } else {
        throw new Error(response.error || 'Error generating URL code.');
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        error: error instanceof Error 
          ? error.message 
          : 'An error occurred while shortening the URL. Please try again.'
      }));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Copy URL handler
  const handleCopyUrl = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(formState.shortenedUrl);
      setFormState(prev => ({ ...prev, isCopied: true }));
      
      // Reset copy state after 2 seconds
      setTimeout(() => {
        setFormState(prev => ({ ...prev, isCopied: false }));
      }, 2000);
    } catch (err) {
      console.error('Error copying URL:', err);
      setFormState(prev => ({
        ...prev,
        error: 'Unable to copy URL. Please try copying manually.'
      }));
    }
  }, [formState.shortenedUrl]);

  // Enter key handler
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !formState.isLoading) {
      handleShorten();
    }
  };

  // Features data
  const features = [
    {
      icon: '⚡',
      title: 'Fast',
      description: 'Instantly shorten your URLs'
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Safe and reliable links'
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Track usage statistics'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="main-title">
          <span className="gradient-text">Shorten</span> your URLs
        </h1>
        <p className="subtitle">
          Transform long links into short, shareable URLs
        </p>
      </div>

      {/* Main Card */}
      <div className="card-container">
        {/* Input Section */}
        <div className="input-wrapper">
          <input
            className="url-input"
            type="url"
            placeholder="Paste your URL here to shorten..."
            value={formState.originalUrl}
            onChange={handleUrlChange}
            onKeyPress={handleKeyPress}
            disabled={formState.isLoading}
          />
          <button 
            className={`shorten-button ${formState.isLoading ? 'loading' : ''}`}
            onClick={handleShorten}
            disabled={formState.isLoading}
            type="button"
          >
            {formState.isLoading ? (
              <div className="spinner" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              'Shorten URL'
            )}
          </button>
        </div>

        {/* Error Message */}
        {formState.error && (
          <div className="error-container" role="alert">
            <span className="error-icon">!</span>
            <p className="error-message">{formState.error}</p>
          </div>
        )}

        {/* Success Result */}
        {formState.shortenedUrl && (
          <div className="result-container" role="region">
            <div className="result-header">
              <span className="success-icon">✓</span>
              <h3>URL shortened successfully!</h3>
            </div>
            <div className="shortened-url-container">
              <a
                href={formState.shortenedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shortened-url"
              >
                {formState.shortenedUrl}
              </a>
              <button 
                className="copy-button"
                onClick={handleCopyUrl}
                type="button"
              >
                {formState.isCopied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="features-section">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <p>Want more advanced features?</p>
        <button 
          className="login-button"
          onClick={() => navigate('/login')}
          type="button"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;