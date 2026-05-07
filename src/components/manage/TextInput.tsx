interface TextInputProps {
  labelText: string;
  name: string | null;
  placeholder?: string;
  value: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const textInputStyle = 'input input-bordered input-primary w-full mb-3 mt-3 input-sm';

const TextInput: React.FunctionComponent<TextInputProps> = (props: TextInputProps) => {
  const value = props.value || '';
  const name = props.name || '';
  return (
    <>
      {props.labelText && (
        <label className="label">
          <span className="label-text">{props.labelText}</span>
        </label>
      )}
      <input
        type="text"
        className={textInputStyle}
        value={value}
        onChange={props.onChange}
        name={name}
        placeholder={props.placeholder}
      />
    </>
  );
};

export default TextInput;
