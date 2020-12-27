import { NavigationSettings } from "../../models/Settings";

export interface INavigationProps {
  navigation: NavigationSettings;
  onTryToChange: (to: NavigationSettings, form: NavigationSettings) => void;
}

export function NavigationCommand({
  navigation,
  onTryToChange,
}: INavigationProps) {
  const onChange = (to: any) => {
    onTryToChange({ ...navigation, ...to }, navigation);
  };

  const getValidNumber = (num: number) => Math.max(0, num) || 0;

  return (
    <div className="item">
      <button
        onClick={() =>
          onChange({ pageI: getValidNumber(navigation.pageI - 1) })
        }
        type="button"
      >
        &lt;
      </button>
      <input
        onChange={({ target }) =>
          onChange({ pageI: getValidNumber(parseInt(target.value) - 1) })
        }
        value={navigation.pageI + 1}
        className="counter"
        type="text"
      />
      <button
        onClick={() => onChange({ pageI: navigation.pageI + 1 })}
        type="button"
      >
        &gt;
      </button>
      <div className="row-2">
        <label>
          <input
            onChange={({ target }) =>
              onChange({ separator: target.value.trim() })
            }
            value={navigation.separator}
            style={{ width: "80px" }}
            type="text"
          />
        </label>
        <input
          onChange={({ target }) =>
            onChange({ length: getValidNumber(parseInt(target.value)) })
          }
          value={navigation.length}
          style={{ width: "40px" }}
          type="text"
        />
      </div>
    </div>
  );
}
