function Basic() {
  return (
    <>
      <div className="basic-info-section">
        <div className="basic-name-section">
          <p className="basic-name-head">Name</p>
          <p className="basic-name-desc">
            Choose a channel name that represents you and your content. Changes
            made to your name and picture are visible only on YouTube.{" "}
          </p>
          <input type="text" className="channel-name-inp" />
        </div>
        <div className="basic-description-section"></div>
        <div className="basic-channelurl-section"></div>
        <div className="basic-links-section"></div>
        <div className="basic-contact-section"></div>
      </div>
    </>
  );
}

export default Basic;
