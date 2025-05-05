export default function Tile({ tile, onClick }) {
    const tileClass = `child111 ${tile.revealed ? (tile.isMine ? "mine1" : "gem1") : ""}`;
    return (
      <div className={tileClass} onClick={onClick}>
        {tile.revealed ? (tile.isMine ? "💣" : "💎") : ""}
      </div>
    );
  }
  