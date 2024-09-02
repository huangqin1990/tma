import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import twaLogo from './assets/tapps.png'
import viteLogo from '/vite.svg'
import './App.css'
import jsQR from 'jsqr'

import WebApp from '@twa-dev/sdk'

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const video = document.getElementById('video') as HTMLVideoElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const output = document.getElementById('output') as HTMLParagraphElement;
    // 请求摄像头权限
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        video.srcObject = stream;
        video.play().then(() => {
          scanQRCode();
        }).catch(error => {
          console.error('Error playing the video:', error);
        });
        scanQRCode();
      })
      .catch(error => {
        console.error('Error accessing the camera:', error);
        output.textContent = 'Unable to access the camera';
      });

    function scanQRCode() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          console.log('code', code);
          output.textContent = `QR Code Data: ${code.data}`;
        } else {
          output.textContent = 'Scanning...';
        }
      }
      requestAnimationFrame(scanQRCode);
    }
  }, [])



  return (
    <>
     <video id="video" autoPlay></video>
        <canvas id="canvas" hidden></canvas>
        <p id="output">Scanning...</p>
      {/* <div>
       
        <a href="https://ton.org/dev" target="_blank">
          <img src={twaLogo} className="logo" alt="TWA logo" />
        </a>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>TWA + Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <div className="card">
        <button onClick={() => WebApp.showAlert(`Hello World! Current count is ${count}`)}>
          Show Alert
        </button>
      </div> */}
    </>
  )
}

export default App
