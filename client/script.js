import { fetchAIResponse } from './utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const inputArea = document.getElementById('note-input');
    const processBtn = document.getElementById('process-btn');
    const loader = document.getElementById('loader');
    const outputSection = document.getElementById('output-section');
    const charCount = document.getElementById('char-count');

    // 1. Character count update
    inputArea.addEventListener('input', () => {
        charCount.textContent = `${inputArea.value.length} characters`;
    });

    // 2. Clear button logic
    document.getElementById('clear-btn').addEventListener('click', () => {
        inputArea.value = '';
        outputSection.classList.add('hidden');
        charCount.textContent = '0 characters';
    });

    // 3. Save to LocalStorage logic
    document.getElementById('save-btn').addEventListener('click', () => {
        localStorage.setItem('rtg_saved_note', inputArea.value);
        alert('Note saved locally! ');
    });

    // 4. Copy to Clipboard logic (Reusable)
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const textToCopy = document.getElementById(targetId).innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalIcon = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                setTimeout(() => btn.innerHTML = originalIcon, 2000);
            });
        });
    });

    // 5. Main API call
    processBtn.addEventListener('click', async () => {
        const text = inputArea.value.trim();
        if (!text) return alert('Bhai, pehle notes toh paste karo!');

        processBtn.disabled = true;
        loader.classList.remove('hidden');
        outputSection.classList.add('hidden');

        try {
            const data = await fetchAIResponse(text);
            
            // Populating UI with safety checks
            document.getElementById('out-summary').innerHTML = `<ul>${data.summary.map(item => `<li>${item}</li>`).join('')}</ul>`;
            document.getElementById('out-english').innerHTML = `<p>${data.englishExplanation}</p>`;
            document.getElementById('out-hinglish').innerHTML = `<p>${data.hinglishExplanation}</p>`;
            document.getElementById('out-keys').innerHTML = `<ul>${data.keyPoints.map(item => `<li><strong>${item.term}:</strong> ${item.def}</li>`).join('')}</ul>`;
            document.getElementById('out-example').innerHTML = `<p>${data.realLifeExample}</p>`;
            
            loader.classList.add('hidden');
            outputSection.classList.remove('hidden');
            outputSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('App Error: - script.js:64', error);
            alert('Server is not working , please wait! ');
            loader.classList.add('hidden');
        } finally {
            processBtn.disabled = false;
        }
    });
});