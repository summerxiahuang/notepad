// Enhanced note management functionality
function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        const noteElement = document.getElementById(`note-${noteId}`);
        
        // Add fade-out animation
        noteElement.style.transition = 'all 0.3s ease';
        noteElement.style.opacity = '0';
        noteElement.style.transform = 'translateX(-100px)';
        
        setTimeout(() => {
            fetch("/delete-note", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ noteId: noteId }),
            }).then((response) => {
                if (response.ok) {
                    noteElement.remove();
                    updateStats();
                    showNotification('Note deleted successfully!', 'success');
                } else {
                    showNotification('Error deleting note', 'error');
                }
            }).catch((error) => {
                console.error('Error:', error);
                showNotification('Error deleting note', 'error');
            });
        }, 300);
    }
}

// Clear all notes functionality
function clearAllNotes() {
    if (confirm('Are you sure you want to delete all notes? This action cannot be undone.')) {
        fetch("/clear-all-notes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                document.getElementById('notes').innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-journal-x display-1 text-muted"></i>
                        <h5 class="mt-3 text-muted">No notes yet</h5>
                        <p class="text-muted">Create your first note to get started!</p>
                    </div>
                `;
                updateStats();
                showNotification('All notes cleared successfully!', 'success');
            } else {
                showNotification('Error clearing notes', 'error');
            }
        }).catch((error) => {
            console.error('Error:', error);
            showNotification('Error clearing notes', 'error');
        });
    }
}

// Export notes functionality
function exportNotes() {
    fetch("/export-notes", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (response.ok) {
            return response.blob();
        } else {
            throw new Error('Export failed');
        }
    }).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notes_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification('Notes exported successfully!', 'success');
    }).catch((error) => {
        console.error('Error:', error);
        showNotification('Error exporting notes', 'error');
    });
}

// Search functionality
function searchNotes(query) {
    const notes = document.querySelectorAll('.note-item');
    const results = [];
    
    notes.forEach(note => {
        const text = note.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            results.push(note);
        }
    });
    
    return results;
}

// Update statistics
function updateStats() {
    const totalNotes = document.querySelectorAll('.note-item').length;
    const statsElements = document.querySelectorAll('.stats-number');
    if (statsElements.length > 0) {
        statsElements[0].textContent = totalNotes;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'error' ? 'alert-danger' : 'alert-info';
    
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Enhanced form submission
document.addEventListener('DOMContentLoaded', function() {
    const noteForm = document.getElementById('noteForm');
    const noteTextarea = document.getElementById('note');
    
    if (noteForm) {
        noteForm.addEventListener('submit', function(e) {
            const noteText = noteTextarea.value.trim();
            if (noteText.length < 1) {
                e.preventDefault();
                showNotification('Note cannot be empty!', 'error');
                noteTextarea.focus();
                return false;
            }
            
            // Add loading state
            const submitBtn = noteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Adding...';
            submitBtn.disabled = true;
            
            // Reset button after form submission
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Auto-resize textarea
    if (noteTextarea) {
        noteTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit note
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && noteTextarea && document.activeElement === noteTextarea) {
            noteForm.submit();
        }
        
        // Ctrl/Cmd + K to search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));
            searchModal.show();
        }
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value;
            const results = searchNotes(query);
            const resultsContainer = document.getElementById('searchResults');
            
            if (query.length > 0) {
                resultsContainer.innerHTML = results.map(note => {
                    const noteText = note.querySelector('p').textContent;
                    const noteDate = note.querySelector('.note-date').textContent;
                    return `
                        <div class="card mb-2">
                            <div class="card-body">
                                <p class="mb-1">${noteText}</p>
                                <small class="text-muted">${noteDate}</small>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                resultsContainer.innerHTML = '<p class="text-muted">Start typing to search notes...</p>';
            }
        });
    }
});

// Add smooth animations for note items
document.addEventListener('DOMContentLoaded', function() {
    const notes = document.querySelectorAll('.note-item');
    notes.forEach((note, index) => {
        note.style.opacity = '0';
        note.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            note.style.transition = 'all 0.3s ease';
            note.style.opacity = '1';
            note.style.transform = 'translateY(0)';
        }, index * 100);
    });
});