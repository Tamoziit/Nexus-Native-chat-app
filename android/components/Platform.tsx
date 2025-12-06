import Svg, { Ellipse, Defs, RadialGradient, Stop } from "react-native-svg";

const Platform = () => {
	const centerX = 130;
	const centerY = 60;
	const radiusX = 120;
	const radiusY = 50; // Compressed Y for perspective
	
	// Generate dots in a circular pattern with perspective
	const dots = [];
	const rows = 15;
	const colsPerRow = 40;
	
	for (let row = 0; row < rows; row++) {
		const rowProgress = row / (rows - 1); // 0 to 1
		const currentRadiusX = radiusX * (1 - rowProgress);
		const currentRadiusY = radiusY * (1 - rowProgress);
		
		// More dots in outer rings
		const dotsInThisRow = Math.max(8, Math.floor(colsPerRow * (1 - rowProgress * 0.3)));
		
		for (let i = 0; i < dotsInThisRow; i++) {
			const angle = (i / dotsInThisRow) * Math.PI * 2;
			const x = centerX + Math.cos(angle) * currentRadiusX;
			const y = centerY + Math.sin(angle) * currentRadiusY;
			
			// Calculate opacity based on distance from center (fade at edges)
			const opacity = Math.pow(rowProgress, 1.5);
			
			// Vary dot size slightly for depth
			const size = 1.8 - rowProgress * 0.6;
			
			dots.push({
				x,
				y,
				size,
				opacity,
				key: `${row}-${i}`
			});
		}
	}
	
	return (
		<Svg width={260} height={120}>
			<Defs>
				<RadialGradient id="fade" cx="50%" cy="50%" r="60%">
					<Stop offset="0%" stopColor="rgba(22, 134, 58, 1)" />
					<Stop offset="60%" stopColor="rgba(22, 134, 58, 0.6)" />
					<Stop offset="100%" stopColor="rgba(22, 134, 58, 0)" />
				</RadialGradient>
			</Defs>

			{/* Render dots */}
			{dots.map((dot) => (
				<Ellipse
					key={dot.key}
					cx={dot.x}
					cy={dot.y}
					rx={dot.size}
					ry={dot.size * 0.6} // Slight vertical compression for perspective
					fill="url(#fade)"
					opacity={dot.opacity}
				/>
			))}
		</Svg>
	);
};

export default Platform;