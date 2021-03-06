import { useEffect, useState } from 'react';
import { IpcRendererEvent } from 'electron';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Spinner from '../../../shared/components/spinner/spinner';
import AcceptButton from '../../../shared/components/accept-button/accept-button';
import WelcomeSnippet from '../welcome-snippet/welcome-snippet';

const DASHBOARD_DOWNLOAD_URL =
  'https://repository.sonatype.org/service/local/artifact/maven/redirect?r=central-proxy&g=com.devonfw.tools.ide&a=devonfw-ide-scripts&v=LATEST&p=tar.gz';

export default function WelcomeToDevonfw(): JSX.Element {
  const [total, setTotal] = useState(0);
  const [received, setReceived] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(false);
  const [downloadStatusMsg, setDownloadStatusMsg] = useState('');
  const [downloadStatusMsgColor, setDownloadStatusMsgColor] = useState(
    'error.main'
  );

  useEffect(() => {
    global.ipcRenderer.on(
      'download progress',
      (_: IpcRendererEvent, arg: { total: number; received: number }) => {
        setTotal(arg.total);
        setReceived(arg.received);
        setDownloadProgress(true);
        setDownloadStatusMsg('');
      }
    );

    global.ipcRenderer.on(
      'download completed',
      (_: IpcRendererEvent, arg: string) => {
        setDownloadProgress(false);
        setDownloadStatusMsg('Download was ' + arg + '.');
        if (arg === 'completed') {
          setDownloadStatusMsgColor('success.main');
        } else {
          setDownloadStatusMsgColor('error.main');
        }
      }
    );
  }, []);

  return (
    <Grid container spacing={3} style={{ fontSize: '16px' }}>
      <Grid item xs={12}>
        <img src="/assets/person.png" alt="admin" />
      </Grid>
      <Grid item xs={7}>
        <>
          <WelcomeSnippet></WelcomeSnippet>
          <AcceptButton
            href={DASHBOARD_DOWNLOAD_URL}
            disabled={downloadProgress}
          >
            Download latest version
          </AcceptButton>
          <Spinner
            inProgress={downloadProgress}
            progress={(received / total) * 100}
          ></Spinner>
          <Box component="p" color={downloadStatusMsgColor}>
            {downloadStatusMsg}
          </Box>
        </>
      </Grid>
    </Grid>
  );
}
