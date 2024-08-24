import React, { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

const Demo = ({rotation}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [array, setArray] = useState([])
    const [handPresence, setHandPresence] = useState(null);

    useEffect(() => {
        let handLandmarker;
        let animationFrameId;

        const initializeHandDetection = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
                );
                handLandmarker = await HandLandmarker.createFromOptions(
                    vision, {
                        baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task" },
                        numHands: 1,
                        runningMode: "video"
                    }
                );
                detectHands();
            } catch (error) {
                console.error("Error initializing hand detection:", error);
            }
        };

//     const drawLandmarks = (landmarksArray) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = 'white';

//     landmarksArray.forEach(landmarks => {
//         landmarks.forEach(landmark => {
//             const x = landmark.x * canvas.width;
//             const y = landmark.y * canvas.height;
//             ctx.beginPath();
//             ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw a circle for each landmark
//             ctx.fill();
//         });
//     });
// };

        const detectHands = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                const detections = handLandmarker.detectForVideo(videoRef.current, performance.now());
                setHandPresence(detections.handednesses.length > 0);

                // Assuming detections.landmarks is an array of landmark objects
                if (detections.landmarks) {
                    rotation(detections.landmarks[0]);
                }
            }
            requestAnimationFrame(detectHands);
        };

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
                await initializeHandDetection();
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startWebcam();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            if (handLandmarker) {
                handLandmarker.close();
            }
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };

    }, []);

    return (
        <>
        <h3 style={{position:'absolute', color:'white', top:'0px', left:'20px', userSelect: 'none'}}>Mano detectada: {handPresence ? "Si" : "No"}</h3>
        <h3 style={{position:'absolute', color:'white', top:'20px', left:'20px', userSelect: 'none'}}>Mouse habilitado: {rotation.length != 0 ? "Si" : "No"}</h3>
        <div style={{ position: "relative", display:'none' }}>
            <video ref={videoRef} autoPlay playsInline ></video>
        </div>
    </>
    );
};

export default Demo;