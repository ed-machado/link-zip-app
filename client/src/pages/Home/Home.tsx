import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { encurtarUrl } from '../../Services/urlServices';
import './Home.css';

function Home() {
  const [urlOriginal, setUrlOriginal] = useState('');
  const [urlEncurtada, setUrlEncurtada] = useState('');
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEncurtar = async () => {
    if (!urlOriginal.trim()) {
      setErro('Por favor, insira uma URL válida.');
      return;
    }

    setIsLoading(true);
    setErro('');

    try {
      const response = await encurtarUrl(urlOriginal);

      if (response.urlCode) {
        const formattedUrl = `http://localhost:5001/api/url/${response.urlCode}`;
        setUrlEncurtada(formattedUrl);
        setErro('');
      } else {
        setErro('Erro ao gerar o código da URL.');
      }
    } catch (error) {
      setErro('Ocorreu um erro ao encurtar a URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(urlEncurtada);
      const button = document.querySelector('.copy-button');
      if (button) {
        button.textContent = 'Copiado!';
        setTimeout(() => {
          button.textContent = 'Copiar URL';
        }, 2000);
      }
    } catch (err) {
      console.error('Erro ao copiar URL:', err);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-title">
          <span className="gradient-text">Encurte</span> suas URLs
        </h1>
        <p className="subtitle">
          Transforme links longos em URLs curtas e fáceis de compartilhar
        </p>
      </div>

      <div className="card-container">
        <div className="input-wrapper">
          <input
            className="url-input"
            type="text"
            placeholder="Cole a URL aqui para encurtar..."
            value={urlOriginal}
            onChange={(e) => setUrlOriginal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEncurtar()}
          />
          <button 
            className={`shorten-button ${isLoading ? 'loading' : ''}`}
            onClick={handleEncurtar}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Encurtar URL'
            )}
          </button>
        </div>

        {erro && (
          <div className="error-container">
            <span className="error-icon">!</span>
            <p className="error-message">{erro}</p>
          </div>
        )}

        {urlEncurtada && (
          <div className="result-container">
            <div className="result-header">
              <span className="success-icon">✓</span>
              <h3>URL encurtada com sucesso!</h3>
            </div>
            <div className="shortened-url-container">
              <a
                href={urlEncurtada}
                target="_blank"
                rel="noopener noreferrer"
                className="shortened-url"
              >
                {urlEncurtada}
              </a>
              <button 
                className="copy-button"
                onClick={handleCopyUrl}
              >
                Copiar URL
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Rápido</h3>
          <p>Encurte URLs instantaneamente</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Seguro</h3>
          <p>Links seguros e confiáveis</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Análises</h3>
          <p>Acompanhe estatísticas de uso</p>
        </div>
      </div>

      <div className="cta-section">
        <p>Quer mais recursos avançados?</p>
        <button 
          className="login-button"
          onClick={() => navigate('/login')}
        >
          Fazer Login
        </button>
      </div>
    </div>
  );
}

export default Home;