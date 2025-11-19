// Main JavaScript functionality for Mamzo's Kota website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initAccordions();
    initModal();
    initGallery();
    initSearch();
    initFormValidation();
    initSmoothScroll();
    initAnimations();
});

// Accordion functionality for FAQs
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion-header');
    
    accordions.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');
            
            // Close all accordions
            document.querySelectorAll('.accordion-content').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open current one if it wasn't active
            if (!isActive) {
                content.classList.add('active');
            }
        });
    });
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');
    
    if (!modal) return;
    
    // Close modal when clicking X
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Gallery functionality with lightbox
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            
            if (modal && modalImg) {
                modalImg.src = imgSrc;
                modal.style.display = 'block';
            }
        });
    });
}

// Search functionality
function initSearch() {
    const searchBox = document.getElementById('searchBox');
    
    if (!searchBox) return;
    
    searchBox.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const menuItems = document.querySelectorAll('#menuTable tr');
        
        if (menuItems.length > 0) {
            menuItems.forEach((row, index) => {
                if (index === 0) return; // Skip header row
                
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }
    });
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        showSuccessMessage(form);
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const errorElement = field.parentElement.querySelector('.error') || createErrorElement(field);
    
    // Clear previous error
    clearError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function createErrorElement(field) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    field.parentElement.appendChild(errorElement);
    return errorElement;
}

function showError(field, message) {
    const errorElement = field.parentElement.querySelector('.error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    field.classList.add('input-error');
}

function clearError(field) {
    const errorElement = field.parentElement.querySelector('.error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    field.classList.remove('input-error');
}

function showSuccessMessage(form) {
    let successElement = form.querySelector('.success-message');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'success-message';
        form.appendChild(successElement);
    }
    
    successElement.textContent = 'Thank you! Your message has been sent successfully.';
    successElement.style.display = 'block';
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 5000);
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Animations
function initAnimations() {
    // Add animation class to elements when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements that should animate
    document.querySelectorAll('img, table, form').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// AJAX form submission
function submitFormAJAX(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('input[type="submit"]');
    const originalText = submitButton.value;
    
    // Show loading state
    submitButton.value = 'Sending...';
    submitButton.disabled = true;
    
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showSuccessMessage(form);
            form.reset();
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        alert('Sorry, there was an error submitting your form. Please try again.');
    })
    .finally(() => {
        // Reset button state
        submitButton.value = originalText;
        submitButton.disabled = false;
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global access
window.MamzosKota = {
    initAccordions,
    initModal,
    initGallery,
    initSearch,
    validateForm,
    submitFormAJAX
};