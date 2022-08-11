export default function HorizontalProgress({bgcolor, progress, label, numLabel, barLabel}){
  const Parentdiv = {
    height: '2rem',
    width: '85%',
    backgroundColor: '#29b674',
    border: "1px solid black",
    display: "flex",
    alignItems: "flex-end",
    marginBottom: '4rem'
  }
  const Childdiv = {
    height:'95%',
    width: `${progress}%`,
    backgroundColor: bgcolor,
    border: "1px solid black",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }
  const progresstext = {
    padding: 0,
    color: 'white',
    fontSize: ".8rem",
    width: "100%",
    textAlign: "center",
  }
  return(
    <>
    <h3 className = "progress-label">{barLabel}</h3>
    <div style={Parentdiv}>
      <div style={Childdiv}>
        <span style={progresstext}>{label}</span>
        <span style={progresstext}>{`${numLabel}`}</span>
      </div>
    </div>
    </>
  );
};
