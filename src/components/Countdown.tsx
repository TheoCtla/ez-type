interface CountdownProps {
  count: number;
}

export function Countdown({ count }: CountdownProps) {
  return (
    <div className="countdown">
      <div className="countdown-number" key={count}>
        {count}
      </div>
      <p className="countdown-hint">place tes doigts sur la home row</p>
    </div>
  );
}
