const display = document.getElementById('display');
        const buttons = document.querySelector('.buttons');

        buttons.addEventListener('click', (event) => {
            const target = event.target;
            if (!target.matches('button')) {
                return;
            }

            const value = target.dataset.value;
            const action = target.dataset.action;

            if (value) {
                if (value === '.' && display.value.includes('.')) {
                    return;
                }
                appendValue(value);
            }

            if (action) {
                switch (action) {
                    case 'clear':
                        clearDisplay();
                        break;
                    case 'delete':
                        deleteLastChar();
                        break;
                    case 'calculate':
                        calculateResult();
                        break;
                }
            }
        });

        function appendValue(value) {
            if (display.value === '0' || display.value === 'Error') {
                display.value = value;
            } else {
                display.value += value;
            }
        }

        function clearDisplay() {
            display.value = '';
            display.placeholder = '0';
        }

        function deleteLastChar() {
            display.value = display.value.toString().slice(0, -1);
            if (display.value === '') {
                display.placeholder = '0';
            }
        }

        function calculateResult() {
            try {
                let result = eval(display.value.replace('%', '/100'));
                result = parseFloat(result.toFixed(10));
                display.value = result;
            } catch (error) {
                display.value = 'Error';
            }
        }