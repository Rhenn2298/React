import React from "react";
import { Card, Typography, CardActionArea, CardMedia, Box } from "@mui/material";
import { useTheme } from '@mui/material/styles';




interface CategoryCardProps {
     category: { 
        name: string; 
        image: string; 
    }; 
    onSelect: (
        categoryName: string
    ) => void; 
}

const CategoryCard: React.FC<CategoryCardProps> = ({
     category, 
     onSelect 
    }) => {
        const theme = useTheme();
         return (
            <Card sx={{transition: "0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                },}}>
                <CardActionArea onClick={() => onSelect(category.name)}>
                    <CardMedia 
                        component="img" 
                        image={category.image}
                        height="100"
                        alt={category.name} 
                    />
                    <Box position="absolute" 
                        bottom="0" 
                        left="0" 
                        right="0" 
                        bgcolor="rgba(0, 0, 0, 0)"  
                        padding="10px" 
                        textAlign="center" 
                    >
                        <Typography variant="h6" 
                            component="div" 
                            sx={{ flexGrow: 10, 
                                textAlign:'center',
                                color: theme.palette.primary.main,
                                textShadow: '2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black',
                             }}
                            style={{ fontFamily: 'Protest Revolution, Arial, sans-serif', fontSize: '3rem' }}
                            > 
                            {category.name} 
                        </Typography> 
                    </Box>
                </CardActionArea>
            </Card>
            );
        };
        export default CategoryCard;            