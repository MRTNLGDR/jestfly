
declare namespace JSX {
  interface HTMLAttributes<T> extends React.HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
  
  interface InputHTMLAttributes extends HTMLAttributes<HTMLInputElement> {
    directory?: string;
    webkitdirectory?: string;
  }
}
