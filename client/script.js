import { fetchAIResponse } from './utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const inputArea = document.getElementById('note-input');
    const processBtn = document.getElementById('process-btn');
    const loader = document.getElementById('loader');
    const outputSection = document.getElementById('output-section');
    const charCount = document.getElementById('char-count');

    // Character count update
    inputArea.addEventListener('input', () => {
        charCount.textContent = `${inputArea.value.length} characters`;
    });

    // Clear button logic
    document.getElementById('clear-btn').addEventListener('click', () => {
        inputArea.value = '';
        outputSection.classList.add('hidden');
        charCount.textContent = '0 characters';
    });

    // Main API call
    processBtn.addEventListener('click', async () => {
        const text = inputArea.value.trim();
        if (!text) return alert('Bhai, pehle notes toh paste kar!');

        processBtn.disabled = true;
        loader.classList.remove('hidden');
        outputSection.classList.add('hidden');

        try {
            // Yahan magic hoga - Backend call!
            const data = await fetchAIResponse(text);
            
            document.getElementById('out-summary').innerHTML = `<ul>${data.summary.map(item => `<li>${item}</li>`).join('')}</ul>`;
            document.getElementById('out-english').innerHTML = `<p>${data.englishExplanation}</p>`;
            document.getElementById('out-hinglish').innerHTML = `<p>${data.hinglishExplanation}</p>`;
            document.getElementById('out-keys').innerHTML = `<ul>${data.keyPoints.map(item => `<li><strong>${item.term}:</strong> ${item.def}</li>`).join('')}</ul>`;
            document.getElementById('out-example').innerHTML = `<p>${data.realLifeExample}</p>`;
            
            loader.classList.add('hidden');
            outputSection.classList.remove('hidden');
            outputSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error(error);
            alert('Error! Check console. Make sure Node server is running.');
            loader.classList.add('hidden');
        } finally {
            processBtn.disabled = false;
        }
    });
});