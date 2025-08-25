:root {
  --accent1: #865dff;
  --accent2: #eaacff;
}
body {
  --bg: #f2f4fb;
  --text: #222;
  --box: #fff;
  --result-bg: #f9f9fc;
  background: linear-gradient(135deg, var(--accent1), var(--accent2) 70%);
  color: var(--text);
  font-family: 'Segoe UI', Arial, sans-serif;
  margin: 0;
  min-height: 100vh;
  overflow-x: hidden;
  transition: background 0.7s, color 0.5s;
}
.background-blur {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 70% 60% at 20% 15%, #b3cfff44 25%, transparent 70%),
              radial-gradient(ellipse 48% 38% at 90% 80%, #eaacff33 10%, transparent 85%);
  filter: blur(32px);
}

.container {
  z-index: 2;
  position: relative;
  max-width: 400px;
  margin: 44px auto;
  padding: 32px 24px;
  background: var(--box);
  border-radius: 28px;
  box-shadow: 0 18px 48px 0 rgba(70,48,150,0.26), 0 2px 10px rgba(110,80,160,0.11);
  /* 3D effect */
  transform: perspective(700px) rotateY(-6deg) scale(1.06);
  transition: background 0.5s, box-shadow 0.5s;
}

.card-3d:active {
  transform: perspective(700px) rotateY(0deg) scale(1.03);
}

h1 {
  text-align: center;
  font-size: 2.3rem;
  margin-bottom: 25px;
  letter-spacing: 1.2px;
  font-weight: 600;
}

.theme-switch {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 18px;
}
.theme-switch input {
  display: none;
}
.slider {
  width: 38px;
  height: 18px;
  background: #b0b0b0;
  border-radius: 18px;
  margin: 0 12px;
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.slider:before {
  content: "";
  position: absolute;
  left: 5px;
  top: 3px;
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  transition: 0.3s;
}
.theme-switch input:checked + .slider:before {
  transform: translateX(15px);
  background: #333;
}
.theme-switch input:checked + .slider {
  background: #616161;
}
.upload-area {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin: 13px 0 10px 0;
}
.preview-box {
  width: 128px;
  height: 128px;
  margin: 0 auto 12px auto;
  background: #f0f1f7;
  border-radius: 16px;
  box-shadow: 0 2px 14px rgba(80,66,140,.09);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.4s;
}
.preview-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-box {
  min-height: 65px;
  background: var(--result-bg);
  border-radius: 14px;
  box-shadow: 0 1.5px 8px rgba(80,60,120,0.09);
  margin-top: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.08rem;
}

body.dark {
  --bg: #121214;
  --text: #f7f7fa;
  --box: #21232c;
  --result-bg: #262743;
  background: linear-gradient(135deg, #3e386a 10%, #7f57e0 65%, #19193d 100%);
}
@media (max-width:600px) {
  .container { padding: 14px 3px; }
  .preview-box { width: 92px; height: 92px; }
}
