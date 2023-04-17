import { useState } from 'react'

import { Worker } from '@react-pdf-viewer/core'
import { Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { Button, Typography } from '@mui/material'

function ResumeFileTab() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const sampelPdfFiles = [
    'https://www.africau.edu/images/default/sample.pdf',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'https://www.clickdimensions.com/links/TestPDFfile.pdf'
  ]

  const [pdfFile, setPdfFile] = useState<any>(sampelPdfFiles[0])

  return (
    <div className='container' style={{ padding: '10px' }}>
      <div style={{ marginBottom: '10px' }}>
        {sampelPdfFiles.map((pdfUrl: string, index: number) => (
          <Button onClick={() => setPdfFile(pdfUrl)} sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <img width={28} height={28} alt='invoice.pdf' src='/images/icons/file-icons/pdf.png' />
            <Typography variant='subtitle2' sx={{ ml: 2, fontWeight: 600 }}>
              resume-file-number-{index + 1}.pdf
            </Typography>
          </Button>
        ))}
      </div>
      <div className='viewer'>
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
