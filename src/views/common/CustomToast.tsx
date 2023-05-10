import { uppercaseFirstLetters } from 'src/helpers/functions'

interface CustomToastProps {
  title: string
  body: string
  color: string
}

const CustomToast = ({ title, body, color }: CustomToastProps) => {
  return (
    <div>
      <div>
        <strong>{uppercaseFirstLetters(title)}</strong>
      </div>
      <div>
        <span style={{ color }}>{uppercaseFirstLetters(body)}</span>
      </div>
    </div>
  )
}

export default CustomToast
