from flask import Blueprint, render_template, request, flash, jsonify, send_file
from flask_login import login_required, current_user
from .models import Note
from . import db
import json
from datetime import datetime, timedelta
from io import StringIO

views = Blueprint('views', __name__)


@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    if request.method == 'POST':
        note = request.form.get('note')

        if len(note) < 1:
            flash('Note is too short!', category='error')
        else:
            new_note = Note(data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
            flash('Note added!', category='success')

    # Get statistics data
    today = datetime.now().date()
    week_ago = today - timedelta(days=7)
    
    # Calculate statistics
    total_notes = len(current_user.notes)
    today_notes = len([note for note in current_user.notes if note.date.date() >= today])
    week_notes = len([note for note in current_user.notes if note.date.date() >= week_ago])
    
    return render_template("home.html", 
                         user=current_user, 
                         total_notes=total_notes,
                         today_notes=today_notes,
                         week_notes=week_notes)


@views.route('/delete-note', methods=['POST'])
@login_required
def delete_note():
    note = json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()
            return jsonify({'success': True})
    return jsonify({'success': False}), 400


@views.route('/clear-all-notes', methods=['POST'])
@login_required
def clear_all_notes():
    try:
        # Delete all notes for the current user
        Note.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


@views.route('/export-notes', methods=['GET'])
@login_required
def export_notes():
    try:
        # Get all notes for the current user
        notes = Note.query.filter_by(user_id=current_user.id).order_by(Note.date.desc()).all()
        
        # Create text content
        content = f"Notes Export for {current_user.first_name}\n"
        content += f"Generated on: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}\n"
        content += "=" * 50 + "\n\n"
        
        for i, note in enumerate(notes, 1):
            content += f"{i}. {note.data}\n"
            content += f"   Created: {note.date.strftime('%B %d, %Y at %I:%M %p')}\n\n"
        
        # Create file-like object
        output = StringIO()
        output.write(content)
        output.seek(0)
        
        return send_file(
            StringIO(output.getvalue()),
            mimetype='text/plain',
            as_attachment=True,
            download_name=f'notes_{datetime.now().strftime("%Y-%m-%d")}.txt'
        )
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@views.route('/search-notes', methods=['GET'])
@login_required
def search_notes():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify({'notes': []})
    
    # Search in notes for the current user
    notes = Note.query.filter(
        Note.user_id == current_user.id,
        Note.data.ilike(f'%{query}%')
    ).order_by(Note.date.desc()).limit(10).all()
    
    results = []
    for note in notes:
        results.append({
            'id': note.id,
            'data': note.data,
            'date': note.date.strftime('%B %d, %Y at %I:%M %p')
        })
    
    return jsonify({'notes': results})


@views.route('/health')
def health_check():
    """Health check endpoint for deployment platforms"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })