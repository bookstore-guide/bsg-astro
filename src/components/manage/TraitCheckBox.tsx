interface TraitCheckBoxProps {
  id: number | string;
  changeHandler: (event: React.FormEvent<HTMLInputElement>) => void;
  isChecked: boolean;
  name: string;
}

const TraitCheckBox: React.FunctionComponent<TraitCheckBoxProps> = (props: TraitCheckBoxProps) => {
  const traitId = String(props.id);
  const traitName = String(props.name);

  const selected = props.isChecked ? 'badge-accent' : '';

  return (
    <label
      className={`cursor-pointer badge  ${selected} m-1 p-2.5  border border-primary`}
      key={traitName}>
      {traitName}
      <input
        id={traitId}
        name="traits"
        type="checkbox"
        checked={props.isChecked}
        className="appearance-none w-0"
        onChange={props.changeHandler}
        value={traitId}
      />
    </label>
  );
};

export default TraitCheckBox;
