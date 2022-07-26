import React from 'react';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';

import {Page} from 'components/Page';
import {TitleBar} from 'components/TitleBar';
import {LoadingState} from 'components/LoadingState';
import {useConfigContext} from 'lib/contexts/ConfigContext';
import {OutputOptions, OutputOption} from 'lib/types';
import {listOutputOptions} from 'lib/api';
import {ErrorText} from 'components/ErrorText';
import {usePlayerContext} from 'lib/contexts/PlayerContext';

enum SetupStage {
  NameEntry,
  OutputSelection,
  Applying
};

const NameForm = styled.form`
  margin: auto auto;
  margin-top: auto;
  margin-bottom: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const NameLabel = styled.p`
  font-size: 36pt;
  text-align: center;
  margin: 10px;
`;

const NameEntry = styled.input`
  font-size: 36pt;
  text-align: center;
`;

const SubmitButton = styled.input`
  background-color: red;
  border-radius: 5px;
  font-size: 30pt;
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  align-self: flex-start;
  cursor: pointer;
`;

const SelectorPrompt = styled.h1`
  text-align: center;
  margin-top: 4%;
  font-size: 46pt;
  color: yellow;
`;

const SelectorContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 35%;
  margin-top: auto;
  margin-left: auto;
  margin-right: auto;
  max-width: 75%;
  min-width: 50%;
`;

const SelectorRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const SelectorMiddleColumn = styled.div`
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`;

const SelectorLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
`;

const SelectorRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: right;
`;

const SelectorLabel = styled.p`
  font-size: 36pt;
`;

const SelectorOr = styled.p`
  font-size: 42pt;
  color: yellow;
  text-align: center;
  padding: 12px;
`;

const Selector = styled.select`
  font-size: 24pt;
  margin-bottom: 30px;
`;

type OutputSelectorProps = {
  outputs: OutputOptions;
  onOutputChosen: (output: OutputOption) => void;
}

const OutputSelector: React.FC<OutputSelectorProps> = ({outputs, onOutputChosen})  => {
  const [audioOutput, setAudioOutput] = React.useState<string>(
    outputs.localDevices.length > 1 ? outputs.localDevices[0].identifier : ''
  );
  const [rendererOutput, setRendererOutput] = React.useState<string>(
    outputs.localDevices.length === 0 && outputs.renderers.length > 0 ?
      outputs.renderers[0].identifier : ''
  );

  if (outputs.localDevices.length === 0 && outputs.renderers.length === 0) {
    return <ErrorText>No valid outputs detected</ErrorText>
  }

  const renderOption = (out: OutputOption): React.ReactElement => {
    return (
      <option key={out.identifier} value={out.identifier}>{out.name}</option>
    );
  };
  const locals = outputs.localDevices.map(renderOption);
  const renderers = outputs.renderers.map(renderOption);

  const onAudioChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAudioOutput(event.target.value);
    setRendererOutput('');
  };

  const onRendererChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRendererOutput(event.target.value);
    setAudioOutput('');
  };

  const onOutputSet = () => {
    let output: OutputOption | null = null;
    outputs.localDevices.forEach(out => {
      if (out.identifier === audioOutput) {
        output = out;
      }
    });
    outputs.renderers.forEach(out => {
      if (out.identifier === rendererOutput) {
        output = out;
      }
    });
    if (output) {
      onOutputChosen(output);
    }
  };

  return (
    <SelectorContainer onSubmit={onOutputSet}>
      <SelectorPrompt>Select Output</SelectorPrompt>
      <SelectorRow>
        <SelectorLeftColumn>
          <SelectorLabel>Local Devices</SelectorLabel>
          <Selector value={audioOutput} onChange={onAudioChange}>
            <option value="" disabled hidden>&lt;Unused&gt;</option>
            {locals}
          </Selector>
        </SelectorLeftColumn>
        <SelectorMiddleColumn>
          <SelectorOr>Or</SelectorOr>
        </SelectorMiddleColumn>
        <SelectorRightColumn>
          <SelectorLabel>Network Renderers</SelectorLabel>
          <Selector value={rendererOutput} onChange={onRendererChange}>
            <option value="" disabled hidden>&lt;Unused&gt;</option>
            {renderers}
          </Selector>
        </SelectorRightColumn>
      </SelectorRow>
      <SubmitButton type="submit" onSubmit={onOutputSet} value='Set Output' />
    </SelectorContainer>
  );
};

export const Setup: React.FC = () => {
  const {playerState} = usePlayerContext();
  const {username, setUsername, playerConfig, setPlayerConfig} = useConfigContext();
  const [stage, setStage] = React.useState<SetupStage>(!username ? SetupStage.NameEntry : SetupStage.OutputSelection);
  const [nameText, setNameText] = React.useState<string>('');
  const [outputOptions, setOutputOptions] = React.useState<OutputOptions | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    listOutputOptions().then(options => setOutputOptions(options));
  }, []);

  React.useEffect(() => {
    if (stage === SetupStage.Applying && playerConfig && playerConfig.output && playerState) {
      if (playerState) {
        if (playerState.initialPlaylistChosen) {
          navigate('/player', {replace: true});
        }
        else {
          navigate('/browse', {replace: true});
        }
      }
    }
  }, [playerConfig, stage, navigate, playerState]);

  const nameEntered = () => {
    if (nameText.length > 1) {
      setUsername(nameText);
      if (!playerConfig || !playerConfig.output) {
        setStage(SetupStage.OutputSelection);
      }
      else {
        setStage(SetupStage.Applying);
      }
    }
  };

  if (stage === SetupStage.NameEntry) {
    return (
      <Page>
        <TitleBar/>
        <NameForm onSubmit={nameEntered} style={{height: '100vh'}}>
          <NameLabel>Enter Your Name:</NameLabel>
          <NameEntry type="text" value={nameText} onChange={event => setNameText(event.target.value)} />
          <SubmitButton type="submit" onSubmit={nameEntered} value="Go!" />
        </NameForm>
      </Page>
    )
  }

  if (stage === SetupStage.OutputSelection) {
    if (!outputOptions || !playerConfig) {
      return (
        <>
          <TitleBar />
          <LoadingState/>
        </>
      );
    }

    const onChooseOutput = (output: OutputOption) => {
      setPlayerConfig({output});
      setStage(SetupStage.Applying);
    };

    return (
      <Page>
        <TitleBar/>
        <OutputSelector outputs={outputOptions} onOutputChosen={onChooseOutput} />
      </Page>
    )
  }

  // state = applying. useEffect above handles transition once config is applied
  return (
    <>
      <TitleBar />
      <LoadingState/>
    </>
  );
}
