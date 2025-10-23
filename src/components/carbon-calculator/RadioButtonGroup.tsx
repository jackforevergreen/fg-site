import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type RadioButtonGroupProps = {
  question?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const RadioButtonGroup = ({ question, options, value, onChange }: RadioButtonGroupProps) => {
  return (
    <div className="space-y-2 my-6">
      {question && (
        <h3 className="text-lg font-semibold text-gray-800">{question}</h3>
      )}
      <RadioGroup value={value} onValueChange={onChange}>
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-3 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option} className="text-base cursor-pointer flex-1">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RadioButtonGroup;
