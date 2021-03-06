import React, { useState } from "react";
import { FormLayoutProps, FormProps, FormButton } from "./Form.type";
import Input from "../Input/Input";
import DropDown from "../Dropdown/Dropdown";

const FormLayout : React.FC<FormLayoutProps> = ({
  image, 
  content, 
  inputType, 
  gotoNext, 
  gotoPrevious, 
  show, 
  setObjectData, 
  active, 
  open, 
  submit
}) => {

  return (
      <form onSubmit={submit} className="w-full flex flex-col lg:flex-row items-center flex-shrink-0">
        <img 
          className="w-7/12 lg:w-0 lg:flex-grow"
          src={image}
          alt="form-signup-vector"
        />
        <div className="mt-4 lg:mt-0 lg:ml-16 w-full lg:w-0 lg:flex-grow flex flex-col justify-center items-center flex-shrink-0">
          <h2 className="mb-8 text-lg lg:text-2xl text-center lg:text-left">
            {content}
          </h2>
          {
            inputType[0] === 'input' ? 
              (<Input 
                placeholder={inputType[1]}
                setText={setObjectData}
                type='text'
                icon='enter'
              />) :
              (<DropDown 
                list={inputType[1]}
                setChosenItem={setObjectData}
                placeholder={inputType[2]}
              />)
          }
          <div className="mt-8 flex flex-row justify-between w-4/5 lg:w-9/12">
            <button
              type="button" 
              className={`btn primary fluid mr-2 lg:w-2/5 lg:text-lg ${show(FormButton.Prev)}`}
              onClick={gotoPrevious}
            >
              Prev
            </button>
            <button 
              type="button"
              className={`btn primary fluid ml-2 lg:w-2/5 lg:text-lg`}
              onClick={ active ? open : gotoNext }
            >
              { active ? `Submit` : `Next` }
            </button>
          </div>
        </div>
      </form>
  );
};

const Form : React.FC<FormProps> = ({ data, open }) => {

  const [_active, _setActive] = useState(0);
  const [_filledData, _setFilledData] = useState({});

  console.log(_filledData);

  const goto = (index: number): void => index >= 0 && index <= data.length-1 ? _setActive(index) : undefined;
  const gotoPrevious = (): void => goto(_active - 1);
  const gotoNext = (): void => goto(_active + 1);

  const show = (type: FormButton) => (type === FormButton.Prev && _active === 0) ||
    (type === FormButton.Next && _active === data.length-1) ? 'invisible' : 'visible';

  const _updateFilledDataState = (key: string, value: string) => {
    _setFilledData(prevState => Object.assign({}, prevState, {[key]: value}));
  };

  const _lastPage = () => _active === data.length-1;

  const _handleSubmit = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    _lastPage() ? open() : gotoNext();
  }

  return (
    <div className="flex flex-col overflow-x-hidden w-full">
      <div 
        className="flex flex-row items-center transition duration-500 ease-in-out transform"
        style={{ transform: `translateX(calc(-${_active} * 100%))` }}
      >
        {data.map(({key, image, content, inputType}, index) => (
          <FormLayout 
            key={`#form-page-${index}`}
            image={image}
            content={content}
            inputType={inputType}
            gotoNext={gotoNext}
            gotoPrevious={gotoPrevious}
            show={show}
            setObjectData={ (value: string) => _updateFilledDataState(key, value) }
            active={_active === data.length - 1}
            open={open}
            submit={_handleSubmit}
          />
        ))}
      </div>
    </div>
  );
};

export default Form;