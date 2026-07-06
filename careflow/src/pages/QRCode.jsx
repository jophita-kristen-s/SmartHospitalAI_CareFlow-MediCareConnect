const QRCode = () => {
  const patientId = localStorage.getItem('userId');
  const name      = localStorage.getItem('name');

  return (
    <div>
      <h2>My QR Code</h2>
      <p>Show this to your doctor</p>
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?data=${patientId}&size=200x200`}
        alt="Patient QR Code"
      />
      <p>Patient ID: {patientId}</p>
      <p>Name: {name}</p>
    </div>
  );
};

export default QRCode;