"use client";

export default function LoadingVideo() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <video
        src="/loadvid.mov" // Place your video file in the /public folder
        autoPlay
        loop
        muted
        playsInline
        style={{ width: "150px", height: "100px" }}
      />
    </div>
  );
}