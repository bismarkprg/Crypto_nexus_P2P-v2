interface Props {
  step: number;
}

export default function ProgressBar({ step }: Props) {
  const progress = (step / 3) * 100;

  return (
    <div className="progress-bar">
      <div id="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
}
