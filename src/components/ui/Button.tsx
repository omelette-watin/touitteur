import classNames from "classnames"
import { ComponentPropsWithoutRef } from "react"

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  className?: string
}

const Button = ({
  children,
  className,
  ...otherProps
}: ButtonProps): JSX.Element => {
  return (
    <button
      className={classNames(
        "bg-twitter my-2 rounded-full text-lg font-bold text-white shadow-md hover:bg-[#1a8cd8]",
        className
      )}
      {...otherProps}
    >
      {children}
    </button>
  )
}

export default Button
