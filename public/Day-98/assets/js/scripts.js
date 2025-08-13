import { replaceArray, shuffle, getColor, useAppendableInput, getLastOptions, saveLastOptions } from "./utils.js";

document.addEventListener('DOMContentLoaded', function () {
    const canvas = this.getElementById('wheel');
    const canvasSize = canvas.clientWidth;
    canvas.height = canvasSize;
    canvas.width = canvasSize;
    const options = [];
    let startAngle;
    let arc;
    let spinTimeout;
    let spinAngleStart;
    let spinTime;
    let spinTimeTotal;

    useAppendableInput('inputs', (values) => {
        initWheel(values);

        saveLastOptions(values);
    }, 10);

    initWheel(getLastOptions() || ['Lose', 'Jackpot', 'Max Win', '$10', '$5', '$100', '$50', '$200', '$500', '$1000']);

    function initWheel(opts) {
        // attr
        replaceArray(options, shuffle(opts));

        startAngle = 0;
        arc = Math.PI / (options.length / 2);
        spinTimeout;
        spinAngleStart = 10;
        spinTime = 0;
        spinTimeTotal = 0;
        let ctx;

        document.getElementById('btn-spin').addEventListener('click', spin);

        function drawRouletteWheel() {
            if (canvas.getContext) {
                var outsideRadius = (canvasSize / 2) - 10;
                var insideRadius = canvasSize / 3;
                var textRadius = insideRadius + (outsideRadius - insideRadius) / 2;
                ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvasSize, canvasSize);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                ctx.font = 'bold 12px Helvetica, Arial';

                for (var i = 0; i < options.length; i++) {
                    var angle = startAngle + i * arc;
                    
                    ctx.fillStyle = getColor(i, options.length);
                    ctx.beginPath();
                    ctx.arc(canvasSize / 2, canvasSize / 2, outsideRadius, angle, angle + arc, false);
                    ctx.arc(canvasSize / 2, canvasSize / 2, insideRadius, angle + arc, angle, true);
                    ctx.stroke();
                    ctx.fill();
                    ctx.save();
                    ctx.shadowOffsetX = -1;
                    ctx.shadowOffsetY = -1;
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = "rgb(220,220,220)";
                    ctx.fillStyle = "black";
                    ctx.translate((canvasSize / 2) + Math.cos(angle + arc / 2) * textRadius,
                        (canvasSize / 2) + Math.sin(angle + arc / 2) * textRadius);
                    ctx.rotate(angle + arc / 2 + Math.PI / 2);
                    let text = options[i];
                    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                    ctx.restore();
                }

                //Arrow
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.moveTo((canvasSize / 2) - 4, (canvasSize / 2) - (outsideRadius + 5));
                ctx.lineTo((canvasSize / 2) + 4, (canvasSize / 2) - (outsideRadius + 5));
                ctx.lineTo((canvasSize / 2) + 4, (canvasSize / 2) - (outsideRadius - 5));
                ctx.lineTo((canvasSize / 2) + 9, (canvasSize / 2) - (outsideRadius - 5));
                ctx.lineTo((canvasSize / 2) + 0, (canvasSize / 2) - (outsideRadius - 13));
                ctx.lineTo((canvasSize / 2) - 9, (canvasSize / 2) - (outsideRadius - 5));
                ctx.lineTo((canvasSize / 2) - 4, (canvasSize / 2) - (outsideRadius - 5));
                ctx.lineTo((canvasSize / 2) - 4, (canvasSize / 2) - (outsideRadius + 5));
                ctx.fill();
            }
        }

        function spin() {
            if (spinTime < spinTimeTotal) {
                return;
            }
            spinAngleStart = Math.random() * 10 + 10;
            spinTime = 0;
            spinTimeTotal = Math.random() * 3 + 4 * 1000;
            rotateWheel();
        }

        function rotateWheel() {
            spinTime += 30;
            if (spinTime >= spinTimeTotal) {
                stopRotateWheel();
                return;
            }
            var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
            startAngle += (spinAngle * Math.PI / 180);
            drawRouletteWheel();
            spinTimeout = setTimeout(rotateWheel, 30);
        }

        function stopRotateWheel() {
            clearTimeout(spinTimeout);
            var degrees = startAngle * 180 / Math.PI + 90;
            var arcd = arc * 180 / Math.PI;
            var index = Math.floor((360 - degrees % 360) / arcd);
            ctx.save();
            ctx.font = 'bold 30px Helvetica, Arial';
            var text = options[index]
            ctx.fillText(text, (canvasSize / 2) - ctx.measureText(text).width / 2, (canvasSize / 2) + 10);
            ctx.restore();
        }

        function easeOut(t, b, c, d) {
            var ts = (t /= d) * t;
            var tc = ts * t;
            return b + c * (tc + -3 * ts + 3 * t);
        }

        drawRouletteWheel();

    }
})