document.addEventListener('DOMContentLoaded', function () {
    // Initialize TinyMCE
    tinymce.init({
        selector: '#editor',
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
    });

    // Add event listener for saving content
    document.getElementById('save-content').addEventListener('click', function () {
        const content = tinymce.get('editor').getContent();
        saveContent(content);
    });
});

function saveContent(content) {
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content }),
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Show success message
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
