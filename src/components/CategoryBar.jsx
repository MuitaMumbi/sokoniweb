import { CATEGORIES } from "../data/products";

export default function CategoryBar({ activeCat, setActiveCat }) {
	return (
		<div className="cat-bar">
			<div className="cat-bar-inner">
				{CATEGORIES.map((c) => (
					<span
						key={c.id}
						className={`cat-pill ${activeCat === c.id ? "active" : ""}`}
						onClick={() => setActiveCat(c.id)}
					>
						{c.icon} {c.name}
					</span>
				))}
			</div>
		</div>
	);
}
