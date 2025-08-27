import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Link, 
  IconButton,
  Divider 
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn
} from '@mui/icons-material';

const Footer = () => (
  <Box 
    component="footer" 
    sx={{ 
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
      color: 'white',
      mt: 8,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        pointerEvents: 'none',
      }
    }}
  >
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
      {/* Section principale */}
      <Box sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* À propos */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ffffff, #f0f8ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              Odeo Services
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                mb: 3
              }}
            >
              Votre plateforme de confiance pour tous vos besoins de services. 
              Nous connectons les clients avec les meilleures agences professionnelles.
            </Typography>
            
            {/* Réseaux sociaux */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: <Facebook />, label: 'Facebook' },
                { icon: <Twitter />, label: 'Twitter' },
                { icon: <Instagram />, label: 'Instagram' },
                { icon: <LinkedIn />, label: 'LinkedIn' }
              ].map((social, index) => (
                <IconButton
                  key={index}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                    }
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Liens rapides */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ffffff, #f0f8ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              Liens rapides
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                'Accueil',
                'Services',
                'À propos',
                'Contact',
                'Conditions d\'utilisation',
                'Politique de confidentialité'
              ].map((linkText, index) => (
                <Link
                  key={index}
                  href="#"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    display: 'inline-block',
                    '&:hover': {
                      color: 'white',
                      paddingLeft: '8px',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: '-4px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '0',
                      height: '2px',
                      background: 'linear-gradient(90deg, #ff4d4f, #667eea)',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover::before': {
                      width: '20px',
                    }
                  }}
                >
                  {linkText}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ffffff, #f0f8ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { icon: <Email />, text: 'contact@odeo-services.com' },
                { icon: <Phone />, text: '+33 1 23 45 67 89' },
                { icon: <LocationOn />, text: 'Paris, France' }
              ].map((contact, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <Box
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {contact.icon}
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    {contact.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Divider */}
      <Divider 
        sx={{ 
          borderColor: 'rgba(255, 255, 255, 0.2)',
          mb: 3
        }} 
      />

      {/* Copyright */}
      <Box 
        sx={{ 
          pb: 4,
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.85rem'
          }}
        >
          © {new Date().getFullYear()} Odeo Services. Tous droits réservés. 
          Conçu avec ❤️ pour vous offrir la meilleure expérience.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer;
