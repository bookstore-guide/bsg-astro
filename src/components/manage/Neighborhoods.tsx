import type { Neighborhood } from '../../shared/types';
import TraitCheckBox from './TraitCheckBox';

interface NeighborhoodsProps {
  neighborhoods: Neighborhood[];
  serverNeighborhoods: Neighborhood[];
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Neighborhoods: React.FunctionComponent<NeighborhoodsProps> = (
  props: NeighborhoodsProps
) => {
  const neighborhoods = props.serverNeighborhoods.map((n: Neighborhood) => {
    const match = props.neighborhoods.find((nb) => nb.id === n.id);
    return (
      <TraitCheckBox
        id={n.id}
        key={n.id}
        name={n.name}
        changeHandler={props.onChangeHandler}
        isChecked={match !== undefined}
      />
    );
  });
  return <>{neighborhoods}</>;
};

export default Neighborhoods;
