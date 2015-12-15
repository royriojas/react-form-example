export default function prepend( ele, parent ) {
  parent.insertBefore( ele, parent.firstChild );
}
