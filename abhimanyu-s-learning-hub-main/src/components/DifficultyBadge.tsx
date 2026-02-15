const colorMap = {
  Easy: 'bg-success/15 text-success',
  Medium: 'bg-warning/15 text-warning',
  Hard: 'bg-destructive/15 text-destructive',
};

const DifficultyBadge = ({ difficulty }: { difficulty: 'Easy' | 'Medium' | 'Hard' }) => (
  <span className={`text-xs font-display font-semibold px-2.5 py-1 rounded ${colorMap[difficulty]}`}>
    {difficulty}
  </span>
);

export default DifficultyBadge;
