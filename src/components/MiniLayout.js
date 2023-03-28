import { useRef, useEffect } from "react";

const MiniLayout = (props) => {

    //props.layout
    //props.shelf
    const canvasRef = useRef();
    
    const cellSize = 10;

    const temp = [];
    for (let i = 0; i < props.layout.height; i++) {
        const widthElementArray = [];
        for (let j = 0; j < props.layout.width; j++) {
        
            widthElementArray.push({shelf: null});
        }
        temp.push(widthElementArray);
    }
    
    props.layout.Shelves.forEach((shelf) => {
        
        if (shelf.x1 === shelf.x2) {
            for (let y = shelf.y1; y <= shelf.y2; y++) {                 
                temp[shelf.x1][y] = {shelf: shelf.id};
            }
        } else {
            for (let x = shelf.x1; x <= shelf.x2; x++) {                 
                temp[x][shelf.y1] = {shelf: shelf.id};
            }
        }
    });   

    const drawRect = (ctx,x,y) => {

        /* ctx.fillRect(0,0,10,10); //? 0,0
        ctx.fillRect(10,0,10,10); //? 0,1

        ctx.fillRect(20,0,10,10); //? 0,2 */

        ctx.fillRect(cellSize * x, cellSize * y,10,10);
    }

    useEffect(() => {
     
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        for (let y = 0; y < temp.length; y++) {
            
            for (let x = 0; x < temp[y].length; x++) {
            
                if (temp[y][x].shelf !== null) {                   
                    ctx.fillStyle = "#294b8a";
                } else {                 
                    ctx.fillStyle = "#ebe8e8";
                }
                
                drawRect(ctx,x,y);
            }          
        }
   
    }, [props.layout, props.shelf]);

    let valami = false;
    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const shelfIndexes = [];
        if (props.shelf.x1 === props.shelf.x2) {
            for (let y = props.shelf.y1; y <= props.shelf.y2; y++) {                 
                shelfIndexes.push({x:props.shelf.x1, y:y});
            }
        } else {
            for (let x = props.shelf.x1; x <= props.shelf.x2; x++) {                 
                shelfIndexes.push({x:x, y:props.shelf.y1});
            }
        }
        console.log(shelfIndexes);

        const intervalId = setInterval(() => {     
            valami = !valami;
            if (valami) {                   
                ctx.fillStyle = "#57b4d9";
            } else {                 
                ctx.fillStyle = "#397e99";
            }
            shelfIndexes.forEach((coords) => {
                drawRect(ctx,coords.y,coords.x);
            });
        }, 1000); 
        

        return () => clearInterval(intervalId);
    }, [props.shelf]);


    return (
        <div>
            <canvas width={props.layout.width * cellSize} height={props.layout.height * cellSize} ref={canvasRef}></canvas>
        </div>
    );

}

export default MiniLayout;