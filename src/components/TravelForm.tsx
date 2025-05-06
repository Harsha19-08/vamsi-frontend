import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Fade,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface FormData {
  name: string;
  email: string;
  phone: string;
  dateOfTravel: Date | null;
  source: string;
  reviewScreenshot: File | null;
  ticket: File | null;
}

const sources = ['Redbus', 'Abhibus', 'Direct Website', 'Call'];
const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.2)',
  },
}));

const SuccessCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
  color: 'white',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  textAlign: 'center',
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(4),
  boxShadow: '0 12px 48px 0 rgba(76, 175, 80, 0.3)',
  animation: 'slideUp 0.5s ease-out forwards',
  '@keyframes slideUp': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  textTransform: 'none',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px 2px rgba(33, 203, 243, .4)',
  },
}));

const FileUploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed rgba(0, 0, 0, 0.12)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(33, 150, 243, 0.02)',
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const TravelForm: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    dateOfTravel: null,
    source: '',
    reviewScreenshot: null,
    ticket: null,
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFile = (file: File): string | null => {
    if (!allowedFileTypes.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG and PDF files are allowed.';
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return 'File size too large. Maximum size is 5MB.';
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'reviewScreenshot' | 'ticket') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateFile(file);
      
      if (error) {
        setSnackbar({
          open: true,
          message: error,
          severity: 'error',
        });
        e.target.value = ''; // Reset file input
        return;
      }

      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, dateOfTravel: date }));
  };

  const validateForm = (): string | null => {
    if (!formData.name) return 'Name is required';
    if (!formData.email) return 'Email is required';
    if (!formData.phone) return 'Phone number is required';
    if (!formData.dateOfTravel) return 'Date of travel is required';
    if (!formData.source) return 'Source is required';
    if (!formData.reviewScreenshot) return 'Review screenshot is required';
    if (!formData.ticket) return 'Ticket is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Invalid email format';
    
    // Phone validation (basic)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) return 'Phone number must be 10 digits';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value instanceof Date) {
          formDataToSend.append(key, value.toISOString());
        } else if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch('https://vamsi-saraswatitravels.vercel.app/api/submit-form', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Form submission failed');
      }

      setIsSubmitted(true);
      setSnackbar({
        open: true,
        message: 'Form submitted successfully!',
        severity: 'success',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfTravel: null,
        source: '',
        reviewScreenshot: null,
        ticket: null,
      });
      
      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        (input as HTMLInputElement).value = '';
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to submit form. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in timeout={1000}>
          <SuccessCard>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <CelebrationIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h4" component="h2" gutterBottom>
                  Thank You for Your Submission!
                </Typography>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Your review has been received successfully
                </Typography>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  p: 3, 
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Our team will verify your submission and process the cashback within:
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    24-48 Hours
                  </Typography>
                </Box>
                <Chip
                  icon={<CheckCircleOutlineIcon />}
                  label="Verification in Progress"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '1rem',
                    py: 2,
                    mt: 2
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    mt: 4,
                    bgcolor: 'white',
                    color: '#4CAF50',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    },
                  }}
                  onClick={() => setIsSubmitted(false)}
                >
                  Submit Another Review
                </Button>
              </Box>
            </CardContent>
          </SuccessCard>
        </Fade>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 4,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f9fbff"
        >
        <StyledPaper elevation={3} sx={{ width: '100%', maxWidth: '800px' }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Travel Review Submission
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
              Submit your travel details and get cashback on your bookings
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Box>
                <Box>
                  <DatePicker
                    label="Date of Travel"
                    value={formData.dateOfTravel}
                    onChange={handleDateChange}
                    sx={{ width: '100%' }}
                  />
                </Box>
              </Box>
              <Box>
                <TextField
                  fullWidth
                  select
                  label="Source"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  required
                >
                  {sources.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <FileUploadBox>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => handleFileChange(e, 'reviewScreenshot')}
                    style={{ display: 'none' }}
                    id="review-screenshot-input"
                  />
                  <label htmlFor="review-screenshot-input">
                    <Box sx={{ cursor: 'pointer' }}>
                      <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="subtitle1" gutterBottom>
                        Upload Review Screenshot
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formData.reviewScreenshot
                          ? `Selected: ${formData.reviewScreenshot.name}`
                          : 'Click to upload (JPEG, PNG, PDF)'}
                      </Typography>
                    </Box>
                  </label>
                </FileUploadBox>
                <FileUploadBox>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => handleFileChange(e, 'ticket')}
                    style={{ display: 'none' }}
                    id="ticket-input"
                  />
                  <label htmlFor="ticket-input">
                    <Box sx={{ cursor: 'pointer' }}>
                      <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="subtitle1" gutterBottom>
                        Upload Ticket
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formData.ticket
                          ? `Selected: ${formData.ticket.name}`
                          : 'Click to upload (JPEG, PNG, PDF)'}
                      </Typography>
                    </Box>
                  </label>
                </FileUploadBox>
              </Box>
              <Box sx={{ mt: 2 }}>
                <StyledButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </StyledButton>
              </Box>
            </Box>
          </form>
        </StyledPaper>
        </Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default TravelForm; 