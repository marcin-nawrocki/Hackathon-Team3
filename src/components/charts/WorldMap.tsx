import Svg, { G, Line, Path, Rect } from 'react-native-svg';
import { useTheme } from '../../ThemeContext';
import { COUNTRY_PATHS } from '../../data/worldPaths';

type Props = {
  width: number;
  height: number;
};

const MERIDIANS = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const PARALLELS = [30, 60, 90, 120, 150];

/** Real world map (GeoJSON countries) drawn in an equirectangular 360x180 viewBox. */
export default function WorldMap({ width, height }: Props) {
  const { colors } = useTheme();

  return (
    <Svg width={width} height={height} viewBox="0 0 360 180" preserveAspectRatio="none">
      <Rect x={0} y={0} width={360} height={180} fill={colors.mapOcean} />

      <G opacity={0.5}>
        {MERIDIANS.map((x) => (
          <Line key={`m${x}`} x1={x} y1={0} x2={x} y2={180} stroke={colors.mapGraticule} strokeWidth={0.3} />
        ))}
        {PARALLELS.map((y) => (
          <Line key={`p${y}`} x1={0} y1={y} x2={360} y2={y} stroke={colors.mapGraticule} strokeWidth={0.3} />
        ))}
      </G>

      {COUNTRY_PATHS.map((d, i) => (
        <Path
          key={i}
          d={d}
          fill={colors.mapLand}
          fillRule="evenodd"
          stroke={colors.mapBorder}
          strokeWidth={0.25}
        />
      ))}
    </Svg>
  );
}
