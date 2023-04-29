import { useState } from 'react'

import { ScrollMode, Worker } from '@react-pdf-viewer/core'
import { Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { Card, Divider, Grid, Typography } from '@mui/material'

function ResumeFileTab() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const sampelPdfFiles = [
    'https://www.africau.edu/images/default/sample.pdf',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'https://www.clickdimensions.com/links/TestPDFfile.pdf'
  ]

  const [pdfFile, setPdfFile] = useState<any>(sampelPdfFiles[0])

  return (
    <div style={{ backgroundColor: '#4c4e640d' }}>
      <Typography variant='h6' pt={5} pl={5}>
        Uploaded Resume Files
      </Typography>
      <Grid container xs={12} mb={3} p={3}>
        {sampelPdfFiles.map((pdfUrl: string, index: number) => (
          <Grid item xl={1.3} xs={2} p={3}>
            <Card
              onClick={() => setPdfFile(pdfUrl)}
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
              <img style={{ height: '50%', width: '100%' }} src='/images/pdf-file.avif' />
              <Typography textAlign='center' mt={1} fontSize={12}>
                file{index + 1}.pdf
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider />
      <Typography pl={6} mt={4} fontWeight={500}>
        file{sampelPdfFiles.indexOf(pdfFile) + 1}.pdf View:
      </Typography>
      <div className='viewer' style={{ padding: '15px' }}>
        {pdfFile && (
          <Worker workerUrl='https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js'>
            <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]}></Viewer>
          </Worker>
        )}
      </div>
    </div>
  )
}

export default ResumeFileTab
