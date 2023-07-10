import { useState } from 'react'

import { ScrollMode, Worker } from '@react-pdf-viewer/core'
import { Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { Card, Grid, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { getImagePath } from 'src/helpers/functions'
import Link from 'next/link'

function ResumeFileTab() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const { data: resume } = useSelector((state: any) => state.resume)

  const resumeFiles = resume?.file?.map((resumeFile: string) => getImagePath(resumeFile))

  const [pdfFile, setPdfFile] = useState<any>(resumeFiles?.length > 0 ? resumeFiles[resumeFiles?.length - 1] : '')

  // const downloadFile = (pdfUrl: string) => {
  //   fetch(pdfUrl, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/pdf'
  //     }
  //   })
  //     .then(response => response.blob())
  //     .then(blob => {
  //       const url = window.URL.createObjectURL(new Blob([blob]))

  //       const link: any = document.createElement('a')
  //       link.href = url
  //       link.download = resume?.fullname + '.pdf'

  //       document.body.appendChild(link)

  //       link.click()

  //       link.parentNode.removeChild(link)
  //     })
  // }

  return (
    <>
      <div style={{ width: '1000px' }}></div>
      <Grid container style={{ backgroundColor: '#4c4e640d' }}>
        {resumeFiles?.length > 0 ? (
          <>
            <Grid
              item
              container
              xs={2}
              xl={1.5}
              pt={3}
              pl={3}
              sx={{ overflowY: 'scroll', maxHeight: '320px', justifyContent: 'center' }}
            >
              {resumeFiles?.map((pdfUrl: string, index: number) => (
                <Grid xs={12} item p={1} sx={{ flexBasis: '0% !important' }}>
                  <Card
                    onClick={() => {
                      setPdfFile(pdfUrl)
                      // downloadFile(pdfUrl)
                    }}
                    sx={{
                      py: 2,
                      px: 1,
                      backgroundColor: pdfFile == pdfUrl ? '#f3f2f2' : undefined,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f3f2f2'
                      }
                    }}
                  >
                    <img style={{ height: '50%', width: '45px' }} src='/images/pdf-file.avif' />
                    <Typography textAlign='center' fontSize={12}>
                      file{index + 1}.pdf
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={10} xl={10.5} className='viewer' style={{ padding: '15px', userSelect: 'text' }}>
              <Typography mb={4} fontWeight={500}>
                file{resumeFiles?.indexOf(pdfFile) + 1}.pdf View:
              </Typography>
              {pdfFile && (
                <Worker workerUrl='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js'>
                  <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]}></Viewer>
                </Worker>
              )}
            </Grid>
          </>
        ) : (
          <Grid container p={'10px 40px'}>
            <Typography>There Is Nothing To Show Here!</Typography>
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default ResumeFileTab
