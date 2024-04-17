import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import sampleAudio from "./Noises/BabbleNoise_input.wav"; // Import the first audio file for Voice 1
import sampleAudio1 from "./Noises/BabbleNoise_output.wav"; // Import the second audio file for Voice 1
import sampleAudio2 from "./Noises/BikeNoise_input.wav"; // Import the first audio file for Voice 2
import sampleAudio3 from "./Noises/BikeNoise_output.wav"; // Import the second audio file for Voice 2

function App() {
  const [isPlaying, setIsPlaying] = useState(false); // State to track playback status
  const [now, setNow] = useState(0); // State to track progress bar value
  const [switchOn, setSwitchOn] = useState(false); // State to track switch button status
  const [selectedVoice, setSelectedVoice] = useState("Voice 1"); // State to track selected voice
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0); // State to store current playback time

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      setNow(progress);
    };

    audio.addEventListener("timeupdate", updateProgress);

    audio.addEventListener("ended", () => {
      setIsPlaying(false); // Change icon to play when music finishes
      setCurrentTime(0); // Reset currentTime to 0 when audio ends
    });

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    };
  }, [switchOn]); // Update effect when switch status changes

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause(); // Pause the audio if it's playing
    } else {
      audio.currentTime = currentTime; // Set the current time before playing
      audio.play(); // Play the audio
    }
    setIsPlaying(!isPlaying); // Toggle the playback status
  };

  const handleSwitchChange = () => {
    const audio = audioRef.current;

    // Store the current playback time of the current audio
    const currentPlaybackTime = audio.currentTime;

    // Switch to the other audio source
    audio.src = switchOn ? sampleAudio : sampleAudio1;

    // When the new audio metadata is loaded, set its playback time and start playing
    audio.onloadedmetadata = () => {
      audio.currentTime = currentPlaybackTime;
      audio.play();
    };

    // Update switch button status
    setSwitchOn(!switchOn);

    // Update playback status
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime); // Update current time on time update
  };

  const handleVoiceChange = (voice) => {
    setSelectedVoice(voice); // Update selected voice
    // Update audio source based on the selected voice
    if (voice === "Voice 1") {
      audioRef.current.src = switchOn ? sampleAudio1 : sampleAudio;
    } else if (voice === "Voice 2") {
      audioRef.current.src = switchOn ? sampleAudio3 : sampleAudio2;
    }
    // Play the audio
    audioRef.current.play();
    // Update playback status
    setIsPlaying(true);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="text-center my-2 fw-bold">Features</h1>
      <div className="row mt-5">
        <div className="col-lg-5">
          <div className="row">
            <div className="col-8">
              <h5 className="subtitle">AI Noise Cancellation</h5>
              <p className="py-4 text_body--md">
                Ensure maximum clarity by eliminating background noises, voices
                and echo from both inbound and outbound meetings and calls.
              </p>
              <ul className="px-0">
                <li className="text_body--md list-unstyled">
                  <i className="fa-regular fa-circle-check text-primary"></i>{" "}
                  Works with any conferencing app
                </li>
                <li className="text_body--md list-unstyled">
                  <i className="fa-regular fa-circle-check text-primary"></i>{" "}
                  Works with all call center platforms
                </li>
                <li className="text_body--md list-unstyled">
                  <i className="fa-regular fa-circle-check text-primary"></i>{" "}
                  Works with any headphone and device
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <h5 className="text-center fw-bold">Hear the demo:</h5>
          <div className="row d-flex justify-content-center">
            <div className="col-lg-10">
              <div className="py-4">
                <div className="container bg-secondary rounded-top-5 rounded-bottom-4 border-0 card">
                  <div className="row bg-secondary-subtle rounded-4 border-0 card py-5 px-4">
                    <div className="d-flex align-items-center justify-content-between gap-5">
                      <div className="" onClick={togglePlay}>
                        <div>
                          {isPlaying ? (
                            <i className="fa-regular fa-circle-pause fs-1 text-danger"></i>
                          ) : (
                            <i className="fa-regular fa-circle-play fs-1 text-danger"></i>
                          )}
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        {/* Dynamic progress bar */}
                        <ProgressBar
                          now={isNaN(now) ? 0 : now}
                          label={`${Math.floor(now)}%`}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Audio element */}
                  <audio
                    ref={audioRef}
                    src={switchOn ? sampleAudio1 : sampleAudio}
                    onTimeUpdate={handleTimeUpdate}
                  />
                  <div className="py-4 px-3 text-light">
                    <div className="d-flex justify-content-center gap-3 align-items-center">
                      <div>Without Krisp</div>
                      <div>
                        <Form>
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            checked={switchOn}
                            onChange={handleSwitchChange}
                          />
                        </Form>
                      </div>
                      <div>With Krisp</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-4">
                <h5 className="fw-bold text-center">
                  Try different noise types
                </h5>
                <div className="d-flex gap-2 justify-content-center my-4">
                  <div>
                    <button
                      className={`btn btn-outline-primary ${
                        selectedVoice === "Voice 1" ? "active" : ""
                      }`}
                      onClick={() => handleVoiceChange("Voice 1")}
                    >
                      Babble Noise
                    </button>
                  </div>
                  <div>
                    <button
                      className={`btn btn-outline-primary ${
                        selectedVoice === "Voice 2" ? "active" : ""
                      }`}
                      onClick={() => handleVoiceChange("Voice 2")}
                    >
                      Bike Noise
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
